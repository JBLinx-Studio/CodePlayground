
import React, { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface GitHubIntegrationProps {
  files: Record<string, { content: string; type: string }>;
}

export const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ files }) => {
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  
  const handleCreateRepo = async () => {
    if (!accessToken) {
      setError("Please provide a GitHub access token");
      return;
    }
    
    if (!repoName) {
      setError("Repository name is required");
      return;
    }
    
    setIsCreating(true);
    setError("");
    
    try {
      // 1. Create repository
      const repoResponse = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          "Authorization": `token ${accessToken}`,
          "Accept": "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: repoName,
          description: repoDescription,
          private: isPrivate,
          auto_init: true
        })
      });
      
      if (!repoResponse.ok) {
        const errorData = await repoResponse.json();
        throw new Error(errorData.message || "Failed to create repository");
      }
      
      const repoData = await repoResponse.json();
      
      // 2. Create/update files in the repository
      for (const [fileName, { content }] of Object.entries(files)) {
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        await fetch(`https://api.github.com/repos/${repoData.full_name}/contents/${fileName}`, {
          method: "PUT",
          headers: {
            "Authorization": `token ${accessToken}`,
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `Add ${fileName}`,
            content: encodedContent
          })
        });
      }
      
      // Success
      alert(`Repository created successfully: ${repoData.html_url}`);
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-[#9ca3af] hover:text-[#e4e5e7] hover:bg-[#242a38] flex items-center gap-1"
        >
          <Github size={18} />
          <span>GitHub</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1f2c] border border-[#374151] text-[#e4e5e7]">
        <DialogHeader>
          <DialogTitle>GitHub Integration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm text-[#9ca3af]">
              GitHub Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your GitHub username"
              className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-[#9ca3af]">
              GitHub Access Token
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Your personal access token"
              className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
            />
            <p className="text-xs text-[#9ca3af]">
              Generate a token with 'repo' scope at{" "}
              <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#6366f1] hover:underline"
              >
                github.com/settings/tokens
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-[#9ca3af]">
              Repository Name
            </label>
            <input
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g., code-playground"
              className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-[#9ca3af]">
              Description (optional)
            </label>
            <input
              value={repoDescription}
              onChange={(e) => setRepoDescription(e.target.value)}
              placeholder="A short description"
              className="w-full p-2 bg-[#242a38] border border-[#374151] rounded text-[#e4e5e7]"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="private-repo"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="private-repo" className="text-sm text-[#9ca3af]">
              Private repository
            </label>
          </div>
          
          <Button
            onClick={handleCreateRepo}
            disabled={isCreating}
            className="w-full mt-4 bg-[#6366f1] text-white hover:bg-[#4f46e5]"
          >
            {isCreating ? "Creating..." : "Create Repository"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
