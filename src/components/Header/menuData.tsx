import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Dashboard",
    path: "/dashboard",
    newTab: false,
  },
  {
    id: 3,
    title: "Hotéis",
    path: "/hotels",
    newTab: false,
  },
  {
    id: 3,
    title: "Quartos",
    path: "/rooms",
    newTab: false,
  },
  {
    id: 4,
    title: "Reservas",
    path: "/bookings",
    newTab: false,
  },
  {
    id: 5,
    title: "Hóspedes",
    path: "/guests",
    newTab: false,
  },
  {
    id: 6,
    title: "Páginas",
    newTab: false,
    submenu: [
      {
        id: 61,
        title: "Sobre",
        path: "/about",
        newTab: false,
      },
      {
        id: 62,
        title: "Preços",
        path: "/pricing",
        newTab: false,
      },
      {
        id: 63,
        title: "Contato",
        path: "/contact",
        newTab: false,
      },
      {
        id: 64,
        title: "Blog",
        path: "/blogs",
        newTab: false,
      },
      {
        id: 66,
        title: "Cadastro",
        path: "/signup",
        newTab: false,
      },
      {
        id: 67,
        title: "Login",
        path: "/signin",
        newTab: false,
      },
    ],
  },
];
export default menuData;
