
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mockBackend, MockEndpoint } from "@/utils/MockBackendService";
import { AnimatedFileIcon } from "./AnimatedFileIcon";
import { Code, Database, Play, Plus, Trash2, Server } from "lucide-react";
import { toast } from "sonner";
import { StatusBarTooltip } from "./StatusBarTooltip";

export const BackendPanel: React.FC = () => {
  const [endpoints, setEndpoints] = useState(mockBackend.getEndpoints());
  const [activeTab, setActiveTab] = useState<string>("endpoints");
  
  // Form state for new endpoint
  const [newEndpoint, setNewEndpoint] = useState<Partial<MockEndpoint>>({
    path: "/api/",
    method: "GET",
    statusCode: 200,
    responseData: {},
    delay: 300
  });
  
  // Database state
  const [collections, setCollections] = useState<string[]>(
    Object.keys(mockBackend.getCollection("users") ? { users: true } : {})
  );
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [activeCollection, setActiveCollection] = useState<string>(collections[0] || "");
  const [collectionItems, setCollectionItems] = useState<any[]>(
    mockBackend.getCollection(activeCollection) || []
  );
  const [newItemData, setNewItemData] = useState<string>("{\n  \"name\": \"\",\n  \"value\": \"\"\n}");
  
  // Add a new endpoint
  const handleAddEndpoint = () => {
    try {
      // Parse JSON
      const parsedData = typeof newEndpoint.responseData === 'string' 
        ? JSON.parse(newEndpoint.responseData as string)
        : newEndpoint.responseData;
      
      // Create endpoint
      const endpoint: MockEndpoint = {
        path: newEndpoint.path || "/api/example",
        method: newEndpoint.method as MockEndpoint["method"] || "GET",
        responseData: parsedData,
        statusCode: newEndpoint.statusCode || 200,
        delay: newEndpoint.delay
      };
      
      mockBackend.addEndpoint(endpoint);
      setEndpoints(mockBackend.getEndpoints());
      
      // Reset form except for method
      setNewEndpoint({
        ...newEndpoint,
        path: "/api/",
        responseData: {},
        statusCode: 200,
        delay: 300
      });
    } catch (error) {
      toast.error("Invalid JSON response data");
    }
  };
  
  // Delete an endpoint
  const handleDeleteEndpoint = (path: string, method: string) => {
    mockBackend.removeEndpoint(path, method);
    setEndpoints(mockBackend.getEndpoints());
    toast.success("Endpoint removed");
  };
  
  // Add a new collection
  const handleAddCollection = () => {
    if (!newCollectionName) {
      toast.error("Please enter a collection name");
      return;
    }
    
    mockBackend.addCollection(newCollectionName);
    setCollections([...collections, newCollectionName]);
    setActiveCollection(newCollectionName);
    setCollectionItems(mockBackend.getCollection(newCollectionName));
    setNewCollectionName("");
  };
  
  // Add item to collection
  const handleAddItem = () => {
    try {
      const itemData = JSON.parse(newItemData);
      const item = mockBackend.addItem(activeCollection, itemData);
      setCollectionItems(mockBackend.getCollection(activeCollection));
      setNewItemData("{\n  \"name\": \"\",\n  \"value\": \"\"\n}");
      toast.success("Item added to collection");
    } catch (error) {
      toast.error("Invalid JSON data");
    }
  };
  
  // Delete item from collection
  const handleDeleteItem = (id: number | string) => {
    if (mockBackend.deleteItem(activeCollection, id)) {
      setCollectionItems(mockBackend.getCollection(activeCollection));
      toast.success("Item removed from collection");
    }
  };
  
  // Select a collection
  const handleCollectionChange = (collection: string) => {
    setActiveCollection(collection);
    setCollectionItems(mockBackend.getCollection(collection));
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#1c2333] border-l border-[#2e3646]">
      <div className="bg-[#1a1f2c] px-4 py-2 flex justify-between items-center border-b border-[#2e3646]">
        <div className="flex items-center gap-2">
          <Server size={16} className="text-[#6366f1]" />
          <span className="text-sm font-medium">Mock Backend</span>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex flex-col flex-1"
      >
        <TabsList className="flex w-full p-1 bg-[#151922] border-b border-[#2e3646]">
          <TabsTrigger 
            value="endpoints" 
            className="flex-1 data-[state=active]:bg-[#1c2333] data-[state=active]:text-white"
          >
            <Code size={14} className="mr-1.5" />
            API Endpoints
          </TabsTrigger>
          <TabsTrigger 
            value="database" 
            className="flex-1 data-[state=active]:bg-[#1c2333] data-[state=active]:text-white"
          >
            <Database size={14} className="mr-1.5" />
            Database
          </TabsTrigger>
        </TabsList>
        
        {/* API Endpoints Tab */}
        <TabsContent value="endpoints" className="flex-1 p-3 overflow-auto">
          <div className="space-y-4">
            <div className="bg-[#151922] p-3 rounded-md border border-[#2e3646]">
              <h3 className="text-sm font-medium mb-2">Create New Endpoint</h3>
              
              <div className="grid gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <Select 
                    value={newEndpoint.method}
                    onValueChange={(value) => setNewEndpoint({...newEndpoint, method: value as MockEndpoint["method"]})}
                  >
                    <SelectTrigger className="bg-[#1a202c] border-[#2e3646]">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a202c] border-[#2e3646]">
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    value={newEndpoint.path}
                    onChange={(e) => setNewEndpoint({...newEndpoint, path: e.target.value})}
                    placeholder="/api/endpoint"
                    className="col-span-2 bg-[#1a202c] border-[#2e3646]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number"
                    value={newEndpoint.statusCode}
                    onChange={(e) => setNewEndpoint({...newEndpoint, statusCode: parseInt(e.target.value)})}
                    placeholder="Status Code"
                    className="bg-[#1a202c] border-[#2e3646]"
                  />
                  
                  <Input 
                    type="number"
                    value={newEndpoint.delay}
                    onChange={(e) => setNewEndpoint({...newEndpoint, delay: parseInt(e.target.value)})}
                    placeholder="Delay (ms)"
                    className="bg-[#1a202c] border-[#2e3646]"
                  />
                </div>
                
                <Textarea 
                  value={typeof newEndpoint.responseData === 'object' 
                    ? JSON.stringify(newEndpoint.responseData, null, 2) 
                    : newEndpoint.responseData as string
                  }
                  onChange={(e) => setNewEndpoint({...newEndpoint, responseData: e.target.value})}
                  placeholder="{}"
                  rows={5}
                  className="font-mono text-xs bg-[#1a202c] border-[#2e3646]"
                />
                
                <Button 
                  onClick={handleAddEndpoint}
                  className="w-full bg-[#6366f1] hover:bg-[#4f46e5]"
                >
                  <Plus size={14} className="mr-1" />
                  Add Endpoint
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Available Endpoints</h3>
              
              {endpoints.length === 0 ? (
                <div className="bg-[#151922] p-4 rounded-md border border-[#2e3646] text-center text-sm text-gray-400">
                  No endpoints defined yet
                </div>
              ) : (
                <div className="space-y-2">
                  {endpoints.map((endpoint, index) => (
                    <div 
                      key={`${endpoint.method}-${endpoint.path}-${index}`}
                      className="bg-[#151922] p-3 rounded-md border border-[#2e3646] flex justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-xs font-mono rounded ${
                          endpoint.method === 'GET' ? 'bg-blue-900/30 text-blue-400' :
                          endpoint.method === 'POST' ? 'bg-green-900/30 text-green-400' :
                          endpoint.method === 'PUT' ? 'bg-amber-900/30 text-amber-400' :
                          endpoint.method === 'DELETE' ? 'bg-red-900/30 text-red-400' :
                          'bg-purple-900/30 text-purple-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="text-sm font-mono">{endpoint.path}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBarTooltip label={`Status: ${endpoint.statusCode}, Delay: ${endpoint.delay}ms`}>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            endpoint.statusCode >= 200 && endpoint.statusCode < 300 ? 'bg-green-900/30 text-green-400' :
                            endpoint.statusCode >= 300 && endpoint.statusCode < 400 ? 'bg-amber-900/30 text-amber-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            {endpoint.statusCode}
                          </span>
                        </StatusBarTooltip>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteEndpoint(endpoint.path, endpoint.method)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-red-950/30"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Database Tab */}
        <TabsContent value="database" className="flex-1 p-3 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="space-y-4">
              <div className="bg-[#151922] p-3 rounded-md border border-[#2e3646]">
                <h3 className="text-sm font-medium mb-2">Collections</h3>
                
                <div className="flex gap-2 mb-3">
                  <Input 
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name"
                    className="bg-[#1a202c] border-[#2e3646]"
                  />
                  <Button 
                    onClick={handleAddCollection}
                    className="bg-[#6366f1] hover:bg-[#4f46e5]"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {collections.length === 0 ? (
                    <div className="text-center text-sm text-gray-400 py-4">
                      No collections yet
                    </div>
                  ) : (
                    collections.map(collection => (
                      <div 
                        key={collection}
                        onClick={() => handleCollectionChange(collection)}
                        className={`p-2 rounded-md cursor-pointer flex items-center ${
                          activeCollection === collection 
                            ? 'bg-[#6366f1]/20 text-[#6366f1]' 
                            : 'hover:bg-[#1c2333]'
                        }`}
                      >
                        <Database size={14} className="mr-2" />
                        <span className="text-sm">{collection}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {activeCollection && (
                <div className="bg-[#151922] p-3 rounded-md border border-[#2e3646]">
                  <h3 className="text-sm font-medium mb-2">Add to "{activeCollection}"</h3>
                  
                  <Textarea 
                    value={newItemData}
                    onChange={(e) => setNewItemData(e.target.value)}
                    placeholder="{}"
                    rows={5}
                    className="font-mono text-xs bg-[#1a202c] border-[#2e3646] mb-2"
                  />
                  
                  <Button 
                    onClick={handleAddItem}
                    className="w-full bg-[#6366f1] hover:bg-[#4f46e5]"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Item
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {activeCollection && (
                <div className="bg-[#151922] p-3 rounded-md border border-[#2e3646] h-full overflow-hidden flex flex-col">
                  <h3 className="text-sm font-medium mb-2">
                    {activeCollection} ({collectionItems.length} items)
                  </h3>
                  
                  <div className="flex-1 overflow-auto">
                    {collectionItems.length === 0 ? (
                      <div className="text-center text-sm text-gray-400 py-4">
                        No items in this collection
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {collectionItems.map((item, index) => (
                          <div 
                            key={`${item.id || index}`}
                            className="bg-[#1a202c] p-2 rounded-md border border-[#2e3646] flex justify-between"
                          >
                            <div className="flex-1 overflow-hidden">
                              <pre className="text-xs font-mono overflow-hidden text-ellipsis">
                                {JSON.stringify(item, null, 2)}
                              </pre>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteItem(item.id)}
                              className="h-6 w-6 p-0 ml-2 text-gray-400 hover:text-red-400 hover:bg-red-950/30"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
