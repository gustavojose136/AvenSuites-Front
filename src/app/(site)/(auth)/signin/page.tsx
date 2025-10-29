import Signin from "@/components/Auth/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | AvenSuites - Sistema de Gestão Hoteleira",
  description: "Acesse o AvenSuites para gerenciar seu hotel, reservas, quartos e hóspedes em uma única plataforma moderna e completa.",
};

const SigninPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default SigninPage;
