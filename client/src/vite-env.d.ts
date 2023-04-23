/// <reference types="vite/client" />

interface PropertiesProps {
  page: string;
  errors?: { msg: string }[];
  properties?: {
    id: string;
    title: string;
    description: string;
    categoryId?: number | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
    image: string;
    published: boolean;
  }[];
  msg: string;
  redirect?: string;
  pages: number | null;
  currentPage: number | null;
  total: number | null;
  offset: number | null;
  limit: number | null;
}

interface CreateProps {
  page: string;
  errors?: { msg: string }[];
  property?: {
    title: string;
    description: string;
    category?: string | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
  };
  msg: string;
  redirect?: string | null;
  id?: string | null;
}

interface EditProps {
  page: string;
  errors?: { msg: string }[];
  property?: {
    title: string;
    description: string;
    categoryId?: number | string;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
  };
  msg: string;
  redirect?: string | null;
  id?: string | null;
}

interface AddImageProps {
  page: string;
  errors?: { msg: string }[];
  property?: {
    title: string;
    description: string;
    category?: string | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
  };
  msg: string;
  redirect?: string;
}

interface ViewProps {
  page: string;
  errors?: { msg: string }[];
  property?: {
    id: string;
    title: string;
    description: string;
    categoryId?: number | null;
    price: number | null;
    rooms: number | null;
    wc: number | null;
    parking: number | null;
    street: string | null;
    lat: number | null;
    lng: number | null;
    image: string;
    published: boolean;
  };
  user: {
    id: number | null;
    name: string;
    email: string;
  };
  isSeller: boolean;
  msg: string;
  redirect?: string;
}

interface MessagesProps {
  page: string;
  errors?: { msg: string }[];
  messages?: {
    id: number | null;
    message: string;
    createdAt: string;
    propertyId: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }[];
  msg: string;
  redirect?: string;
}

interface HomeProps {
  page: string;
  errors?: { msg: string }[];
  properties?: {
    category: {
      id: number | null;
      name: string;
    };
    categoryId: number | null;
    description: string;
    id: string;
    image: string;
    lat: string;
    lng: string;
    parking: number | null;
    price: number | null;
    published: boolean;
    rooms: number | null;
    street: string;
    title: string;
    userId: number | null;
    wc: number | null;
  }[];
  msg: string;
  redirect?: string | null;
}
