import React, { useState } from 'react';
import { ArrowLeft, Trash2, Plus } from 'lucide-react';

export default function Console({ 
  apps, 
  setApps, 
  newCategoryApps, 
  setNewCategoryApps, 
  popularCategoryApps,
  setPopularCategoryApps,
  onClose 
}: any) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [iconFile, setIconFile] = useState<string | null>(null);
  const [location, setLocation] = useState('Home');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconFile(reader.result as string);
        setIconUrl(''); // Clear URL if file is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || (!iconUrl && !iconFile)) return;

    const finalIconSrc = iconFile || iconUrl;

    const newAppPayload = {
      id: apps.length > 0 ? Math.max(...apps.map((a: any) => a.id)) + 1 : 0,
      name,
      url,
      iconSrc: finalIconSrc,
      location
    };

    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppPayload)
      });

      if (res.ok) {
        const savedApp = await res.json();
        
        const newApp = {
          id: savedApp.id,
          name: savedApp.name,
          url: savedApp.url,
          icon: <img src={savedApp.iconSrc} alt={savedApp.name} className="w-full h-full object-cover" />,
          bg: 'bg-white'
        };

        const newAppIndex = apps.length;
        setApps([...apps, newApp]);
        
        // Always add to New
        setNewCategoryApps([...newCategoryApps, newAppIndex]);
        
        // If Popular is selected, also add to Popular
        if (location === 'Popular') {
          setPopularCategoryApps([...popularCategoryApps, newAppIndex]);
        }
        
        setName('');
        setUrl('');
        setIconUrl('');
        setIconFile(null);
      }
    } catch (error) {
      console.error('Failed to save app:', error);
      alert('Failed to save app');
    }
  };

  const handleDeleteApp = async (indexToDelete: number) => {
    const appToDelete = apps[indexToDelete];

    try {
      const res = await fetch(`/api/apps/${appToDelete.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        const newApps = [...apps];
        newApps.splice(indexToDelete, 1);
        setApps(newApps);

        // Update indices in category arrays
        const updateIndices = (arr: number[]) => 
          arr.filter(idx => idx !== indexToDelete)
             .map(idx => idx > indexToDelete ? idx - 1 : idx);

        setNewCategoryApps(updateIndices(newCategoryApps));
        setPopularCategoryApps(updateIndices(popularCategoryApps));
      }
    } catch (error) {
      console.error('Failed to delete app:', error);
      alert('Failed to delete app');
    }
  };

  return (
    <div className="absolute inset-0 bg-[#1c1c1c] z-50 flex flex-col text-white h-full w-full overflow-hidden">
      <div className="flex items-center p-4 border-b border-white/10 shrink-0">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full mr-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">App Console</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <form onSubmit={handleAddApp} className="flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New App
          </h2>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">App Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. My App"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">App URL</label>
            <input 
              type="url" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">App Icon</label>
            <div className="flex flex-col gap-2">
              <input 
                type="url" 
                value={iconUrl}
                onChange={e => {
                  setIconUrl(e.target.value);
                  if (e.target.value) setIconFile(null);
                }}
                className="bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="Image URL (https://.../icon.png)"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">OR</span>
                <label className="bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white cursor-pointer hover:bg-[#333] transition-colors flex-1 text-center">
                  {iconFile ? 'Image Selected' : 'Upload Image File'}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {(iconUrl || iconFile) && (
                <div className="mt-2 w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 self-center">
                  <img src={iconFile || iconUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400">Location</label>
            <select 
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option>Home</option>
              <option>Popular</option>
            </select>
            <span className="text-xs text-gray-500 mt-1">* Note: App will always be added to 'New' category as well.</span>
          </div>

          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg mt-2 transition-colors"
          >
            Add App
          </button>
        </form>

        <div className="flex flex-col gap-3 pb-8">
          <h2 className="text-lg font-semibold">Added Apps</h2>
          {apps.length === 0 ? (
            <p className="text-gray-500 text-sm">No custom apps added yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {apps.map((app: any, index: number) => {
                return (
                  <div key={app.id} className="flex items-center justify-between bg-[#2a2a2a] p-3 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 flex items-center justify-center">
                        {app.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{app.name}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[150px]">{app.url}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteApp(index)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
