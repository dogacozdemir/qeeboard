import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GroupManagerProps {
  groups: Record<string, string[]>;
  selectedKeys: string[];
  onSaveGroup: (groupName: string, keyIds: string[]) => void;
  onLoadGroup: (groupName: string) => void;
  onDeleteGroup: (groupName: string) => void;
  onRenameGroup?: (oldName: string, newName: string) => void;
  className?: string;
}

const GroupManager: React.FC<GroupManagerProps> = ({
  groups,
  selectedKeys,
  onSaveGroup,
  onLoadGroup,
  onDeleteGroup,
  onRenameGroup,
  className,
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleSaveGroup = () => {
    if (newGroupName.trim() && selectedKeys.length > 0) {
      onSaveGroup(newGroupName.trim(), selectedKeys);
      setNewGroupName('');
      setShowSaveInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveGroup();
    }
    if (e.key === 'Escape') {
      setShowSaveInput(false);
      setNewGroupName('');
    }
  };

  const groupNames = Object.keys(groups);

  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Key Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Saved groups list area (compact). If empty, show Save control here */}
        <div className="space-y-1">
          {groupNames.length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
              {groupNames.map((groupName) => (
                <div
                  key={groupName}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                >
                  {editingGroupName === groupName ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (editingValue.trim() && editingValue.trim() !== groupName && onRenameGroup) {
                              onRenameGroup(groupName, editingValue.trim());
                            }
                            setEditingGroupName(null);
                            setEditingValue('');
                          } else if (e.key === 'Escape') {
                            setEditingGroupName(null);
                            setEditingValue('');
                          }
                        }}
                        onBlur={() => {
                          if (editingValue.trim() && editingValue.trim() !== groupName && onRenameGroup) {
                            onRenameGroup(groupName, editingValue.trim());
                          }
                          setEditingGroupName(null);
                          setEditingValue('');
                        }}
                        className="text-sm h-7 flex-1"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Badge variant="secondary" className="text-xs">
                        {`${groups[groupName].length} keys`}
                      </Badge>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onLoadGroup(groupName)}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          if (onRenameGroup) {
                            setEditingGroupName(groupName);
                            setEditingValue(groupName);
                          }
                        }}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{groupName}</span>
                          <Badge variant="secondary" className="text-xs">
                            {`${groups[groupName].length} keys`}
                          </Badge>
                        </div>
                      </button>
                      <Button
                        onClick={() => onDeleteGroup(groupName)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="">
              {!showSaveInput ? (
                <Button
                  onClick={() => setShowSaveInput(true)}
                  disabled={selectedKeys.length === 0}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Save Selection ({selectedKeys.length} keys)
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Group name..."
                    className="text-sm"
                    autoFocus
                  />
                  <Button
                    onClick={handleSaveGroup}
                    disabled={!newGroupName.trim()}
                    size="sm"
                    variant="default"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* If there are groups, show Save control UNDER the list */}
        {groupNames.length > 0 && (
          <div className="pt-1">
            {!showSaveInput ? (
              <Button
                onClick={() => setShowSaveInput(true)}
                disabled={selectedKeys.length === 0}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-3 h-3 mr-1" />
                Save Selection ({selectedKeys.length} keys)
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Group name..."
                  className="text-sm"
                  autoFocus
                />
                <Button
                  onClick={handleSaveGroup}
                  disabled={!newGroupName.trim()}
                  size="sm"
                  variant="default"
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupManager;