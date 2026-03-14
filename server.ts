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
  app.get("/api/apps", async (req, res) => {
    try {
      const data = await fs.readFile(APPS_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading apps:", error);
      res.status(500).json({ error: "Failed to read apps" });
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
