import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CampaignFormData, CampaignResult } from "@/lib/mockData";

export interface CampaignPreview {
  campaign_summary: string;
  big_idea: string;
  key_messages: string[];
  visual_direction: string;
  audience_insights?: string;
  channel_strategy?: string;
}

export interface CampaignVersion {
  id: string;
  timestamp: Date;
  label: string;
  formData: CampaignFormData | null;
  preview: CampaignPreview | null;
  fullCampaign: CampaignResult | null;
}

interface CampaignContextType {
  formData: CampaignFormData | null;
  setFormData: (data: CampaignFormData | null) => void;
  preview: CampaignPreview | null;
  setPreview: (preview: CampaignPreview | null) => void;
  fullCampaign: CampaignResult | null;
  setFullCampaign: (campaign: CampaignResult | null) => void;
  isGeneratingPreview: boolean;
  setIsGeneratingPreview: (loading: boolean) => void;
  isGeneratingFull: boolean;
  setIsGeneratingFull: (loading: boolean) => void;
  resetCampaign: () => void;
  // Versioning
  versions: CampaignVersion[];
  currentVersionId: string | null;
  saveVersion: (label?: string) => void;
  switchToVersion: (versionId: string) => void;
  duplicateCampaign: () => void;
  undoLastChange: () => boolean;
  canUndo: boolean;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

const generateVersionId = () => `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormDataState] = useState<CampaignFormData | null>(null);
  const [preview, setPreviewState] = useState<CampaignPreview | null>(null);
  const [fullCampaign, setFullCampaignState] = useState<CampaignResult | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [isGeneratingFull, setIsGeneratingFull] = useState(false);
  
  // Versioning state
  const [versions, setVersions] = useState<CampaignVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<CampaignVersion[]>([]);

  // Save current state to undo stack before making changes
  const pushToUndoStack = useCallback(() => {
    if (formData || preview || fullCampaign) {
      const currentState: CampaignVersion = {
        id: generateVersionId(),
        timestamp: new Date(),
        label: "Auto-save",
        formData: formData ? { ...formData } : null,
        preview: preview ? { ...preview } : null,
        fullCampaign: fullCampaign ? { ...fullCampaign } : null,
      };
      setUndoStack(prev => [...prev.slice(-9), currentState]); // Keep last 10
    }
  }, [formData, preview, fullCampaign]);

  // Wrapped setters that push to undo stack
  const setFormData = useCallback((data: CampaignFormData | null) => {
    pushToUndoStack();
    setFormDataState(data);
  }, [pushToUndoStack]);

  const setPreview = useCallback((newPreview: CampaignPreview | null) => {
    pushToUndoStack();
    setPreviewState(newPreview);
  }, [pushToUndoStack]);

  const setFullCampaign = useCallback((campaign: CampaignResult | null) => {
    pushToUndoStack();
    setFullCampaignState(campaign);
  }, [pushToUndoStack]);

  // Save current state as a named version
  const saveVersion = useCallback((label?: string) => {
    const versionNumber = versions.length + 1;
    const newVersion: CampaignVersion = {
      id: generateVersionId(),
      timestamp: new Date(),
      label: label || `Version ${versionNumber}`,
      formData: formData ? { ...formData } : null,
      preview: preview ? { ...preview } : null,
      fullCampaign: fullCampaign ? { ...fullCampaign } : null,
    };
    
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newVersion.id);
    return newVersion;
  }, [formData, preview, fullCampaign, versions.length]);

  // Switch to a specific version
  const switchToVersion = useCallback((versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      pushToUndoStack();
      setFormDataState(version.formData);
      setPreviewState(version.preview);
      setFullCampaignState(version.fullCampaign);
      setCurrentVersionId(versionId);
    }
  }, [versions, pushToUndoStack]);

  // Duplicate current campaign as a new version
  const duplicateCampaign = useCallback(() => {
    const versionNumber = versions.length + 1;
    const newVersion: CampaignVersion = {
      id: generateVersionId(),
      timestamp: new Date(),
      label: `Copy - Version ${versionNumber}`,
      formData: formData ? { ...formData } : null,
      preview: preview ? { ...preview } : null,
      fullCampaign: fullCampaign ? { ...fullCampaign } : null,
    };
    
    setVersions(prev => [...prev, newVersion]);
    setCurrentVersionId(newVersion.id);
    return newVersion;
  }, [formData, preview, fullCampaign, versions.length]);

  // Undo last change
  const undoLastChange = useCallback(() => {
    if (undoStack.length === 0) return false;
    
    const lastState = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    setFormDataState(lastState.formData);
    setPreviewState(lastState.preview);
    setFullCampaignState(lastState.fullCampaign);
    
    return true;
  }, [undoStack]);

  const canUndo = undoStack.length > 0;

  const resetCampaign = () => {
    setFormDataState(null);
    setPreviewState(null);
    setFullCampaignState(null);
    setIsGeneratingPreview(false);
    setIsGeneratingFull(false);
    setVersions([]);
    setCurrentVersionId(null);
    setUndoStack([]);
  };

  return (
    <CampaignContext.Provider
      value={{
        formData,
        setFormData,
        preview,
        setPreview,
        fullCampaign,
        setFullCampaign,
        isGeneratingPreview,
        setIsGeneratingPreview,
        isGeneratingFull,
        setIsGeneratingFull,
        resetCampaign,
        // Versioning
        versions,
        currentVersionId,
        saveVersion,
        switchToVersion,
        duplicateCampaign,
        undoLastChange,
        canUndo,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error("useCampaign must be used within a CampaignProvider");
  }
  return context;
};
