export type Product = {
    id: number;
    name: string;
    photoUrl: string;
    status: string;
    price: number;
    weight: number;
    length: number;
    width: number;
    height: number;
    description: string;
  };
  
export type Customer = {
    receiverId: number;
    name: string;
    status: string;
    phoneNumber: string;
    address: string;
    detailedAddress: string;
    note: string;
    callBeforeSend: boolean,
    receiveAtPost: boolean
    legitLevel: string,
  };
  
export type Store = {
    storeId: number;
    name: string;
    phoneNumber: string;
    address: string;
    detailedAddress: string;
    description: string;
    isDefault: boolean,
    sendAtPost: boolean, 
  };

export type Staff = {
  employeeId: string;
  phone: string;
  email: string;
  permissions: string[];
}

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  
}

export type Order = {
  id: number,
  code: string,
  height: number,
  width: number,
  length: number,
  items: {
    quantity: number,
    price: number,
    product: Product,
  }[],
  store: Store,
  receiver: Customer,
  price: {
      collectionCharge: number,
      itemsPrice: number,
      shippingFee: number,
  },
  orderStatus: string,
  isDocument: boolean,
  isBulky: boolean,
  isFragile: boolean,
  isValuable: boolean,
  delivery: {
    payer: string,
    hasLostInsurance: boolean,
    isCollected: boolean,
    deliveryMethod: string,
    luuKho: string,
    layHang: string,
    giaoHang: string,
    shippingFee: number,
    collectionFee: number,
    isDraft: boolean,
    note: string,
  }
}