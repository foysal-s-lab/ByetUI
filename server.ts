import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";

const APPS_FILE = path.join(process.cwd(), "apps.json");

async function ensureAppsFile() {
  try {
    await fs.access(APPS_FILE);
  } catch {
    await fs.writeFile(APPS_FILE, JSON.stringify([]));
  }
}

async function startServer() {
  await ensureAppsFile();

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.use("/apps", express.static(path.join(process.cwd(), "apps")));
  
  app.get("/api/apps", async (req, res) => {
    try {
      const appsDir = path.join(process.cwd(), "apps");
      const subdirs = await fs.readdir(appsDir, { withFileTypes: true });
      const apps = [];

      for (const dirent of subdirs) {
        if (dirent.isDirectory()) {
          const appName = dirent.name;
          const appPath = path.join(appsDir, appName);
          
          try {
            const url = (await fs.readFile(path.join(appPath, "app.url"), "utf-8")).trim();
            
            let location = "New";
            try {
              location = (await fs.readFile(path.join(appPath, "Location.txt"), "utf-8")).trim();
            } catch {}
            
            let widgetInfo = "";
            try {
              widgetInfo = (await fs.readFile(path.join(appPath, "widget.info"), "utf-8")).trim();
            } catch {}
            
            let isPinned = true;
            try {
              const pinnedContent = await fs.readFile(path.join(appPath, "isPinned.txt"), "utf-8");
              isPinned = pinnedContent.trim().toLowerCase() === 'true';
            } catch {}
            
            // Check for icon
            let iconSrc = `https://picsum.photos/seed/${appName}/64/64`;
            try {
              iconSrc = (await fs.readFile(path.join(appPath, "icon.url"), "utf-8")).trim();
            } catch {
              try {
                await fs.access(path.join(appPath, "icon.png"));
                iconSrc = `/apps/${encodeURIComponent(appName)}/icon.png`;
              } catch {
                try {
                  await fs.access(path.join(appPath, "icon.jpg"));
                  iconSrc = `/apps/${encodeURIComponent(appName)}/icon.jpg`;
                } catch {}
              }
            }

            let order = 999;
            try {
              const orderContent = await fs.readFile(path.join(appPath, "order.txt"), "utf-8");
              order = parseInt(orderContent.trim(), 10);
            } catch {}

            apps.push({
              id: appName,
              name: appName,
              url: url.trim(),
              location: location.trim(),
              widgetInfo: widgetInfo.trim(),
              iconSrc,
              isPinned,
              order
            });
          } catch (e) {
            console.error(`Error reading app ${appName}:`, e);
          }
        }
      }
      
      apps.sort((a, b) => a.order - b.order);
      
      res.json(apps);
    } catch (error) {
      console.error("Error scanning apps:", error);
      res.status(500).json({ error: "Failed to scan apps" });
    }
  });

  app.post("/api/apps", async (req, res) => {
    try {
      const newApp = req.body;
      const data = await fs.readFile(APPS_FILE, "utf-8");
      const apps = JSON.parse(data);
      
      apps.push(newApp);
      await fs.writeFile(APPS_FILE, JSON.stringify(apps, null, 2));
      
      res.json(newApp);
    } catch (error) {
      console.error("Error saving app:", error);
      res.status(500).json({ error: "Failed to save app" });
    }
  });

  app.delete("/api/apps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await fs.readFile(APPS_FILE, "utf-8");
      let apps = JSON.parse(data);
      
      apps = apps.filter((app: any) => app.id !== id);
      await fs.writeFile(APPS_FILE, JSON.stringify(apps, null, 2));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting app:", error);
      res.status(500).json({ error: "Failed to delete app" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
