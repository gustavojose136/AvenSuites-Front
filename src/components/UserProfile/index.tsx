"use client";
import { useApi } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;

}

const UserProfile = () => {
  const { session, isAuthenticated, getUserProfile, loading, error } = useApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    const userProfile = await getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
    } else {
      toast.error("Erro ao carregar perfil do usuário");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <p>Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Erro: {error}</p>
        <button
          onClick={loadProfile}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Perfil do Usuário</h2>
      {profile ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            {profile.image && (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Nenhum perfil encontrado.</p>
      )}
    </div>
  );
};

export default UserProfile;
