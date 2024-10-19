import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CommunityContextType {
  communityName: string;
  description: string;
  banner: string | null;
  icon: string | null;
  topics: string[];
  id?: string;
  setCommunityName: (name: string) => void;
  setDescription: (description: string) => void;
  setBanner: (banner: string | null) => void;
  setIcon: (icon: string | null) => void;
  setTopics: (topics: string[]) => void;
  profilePicture: File | string | null;
  setProfilePicture: (file: File | string | null) => void;
  backgroundPicture: File | string | null;
  setBackgroundPicture: (file: File | string | null) => void;
}

const CommunityContext = createContext<CommunityContextType | null>(null);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({
  children,
}) => {
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<File | string | null>(
    null,
  );
  const [backgroundPicture, setBackgroundPicture] = useState<
    File | string | null
  >(null);

  return (
    <CommunityContext.Provider
      value={{
        communityName,
        description,
        banner,
        icon,
        topics,
        setCommunityName,
        setDescription,
        setBanner,
        setIcon,
        setTopics,
        profilePicture,
        setProfilePicture,
        backgroundPicture,
        setBackgroundPicture,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};
