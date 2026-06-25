const STORAGE_KEY = 'leafLifePortalState';

export function seedPortalState() {
  return {
    nurseries: [
      {
        id: 'nursery-1',
        nurseryName: 'Green Haven Nursery',
        ownerName: 'Asha Rao',
        email: 'asha@greenhaven.com',
        phone: '9876543210',
        address: 'Mansarovar, Jaipur',
        password: 'nursery123',
        status: 'approved',
        isActive: true,
        rating: 4.8,
        location: 'Jaipur',
        revenue: 156000,
        orders: 12,
        productsCount: 5,
      },
      {
        id: 'nursery-2',
        nurseryName: 'Leafy Bliss',
        ownerName: 'Rahul Mehra',
        email: 'rahul@leafybliss.com',
        phone: '9811122233',
        address: 'Sector 15, Gurgaon',
        password: 'nursery123',
        status: 'pending',
        isActive: false,
        rating: 4.4,
        location: 'Gurgaon',
        revenue: 74000,
        orders: 6,
        productsCount: 3,
      },
      {
        id: 'nursery-3',
        nurseryName: 'Bloom & Branch',
        ownerName: 'Priya Nair',
        email: 'priya@bloombranch.com',
        phone: '9911223344',
        address: 'Banjara Hills, Hyderabad',
        password: 'nursery123',
        status: 'approved',
        isActive: true,
        rating: 4.9,
        location: 'Hyderabad',
        revenue: 214000,
        orders: 18,
        productsCount: 7,
      }
    ],
    nurseryProducts: [
      {
        id: 'product-1',
        nurseryId: 'nursery-1',
        name: 'Monstera Deliciosa',
        category: 'Indoor',
        price: 899,
        quantity: 12,
        description: 'Statement indoor plant with lush foliage.',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80',
        availability: 'In Stock',
        sales: 6,
        views: 342,
        wishlistCount: 20,
        trendingScore: 92,
      },
      {
        id: 'product-2',
        nurseryId: 'nursery-1',
        name: 'Snake Plant',
        category: 'Low Maintenance',
        price: 599,
        quantity: 5,
        description: 'Air-purifying hardy plant for homes and offices.',
        image: 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=600&q=80',
        availability: 'Low Stock',
        sales: 4,
        views: 221,
        wishlistCount: 11,
        trendingScore: 84,
      },
      {
        id: 'product-3',
        nurseryId: 'nursery-2',
        name: 'Fiddle Leaf Fig',
        category: 'Decor',
        price: 1299,
        quantity: 4,
        description: 'Elegant plant for bright indoor spaces.',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
        availability: 'In Stock',
        sales: 3,
        views: 187,
        wishlistCount: 8,
        trendingScore: 78,
      },
      {
        id: 'product-4',
        nurseryId: 'nursery-3',
        name: 'Peace Lily',
        category: 'Air Purifying',
        price: 749,
        quantity: 18,
        description: 'Easy-care flowering plant with elegant white blooms.',
        image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80',
        availability: 'In Stock',
        sales: 8,
        views: 412,
        wishlistCount: 26,
        trendingScore: 95,
      },
      {
        id: 'product-5',
        nurseryId: 'nursery-3',
        name: 'ZZ Plant',
        category: 'Low Maintenance',
        price: 649,
        quantity: 7,
        description: 'Glossy, sculptural foliage that thrives in low light.',
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
        availability: 'In Stock',
        sales: 5,
        views: 258,
        wishlistCount: 14,
        trendingScore: 88,
      }
    ],
    nurseryOrders: [
      {
        id: 'order-1',
        nurseryId: 'nursery-1',
        plantName: 'Monstera Deliciosa',
        quantity: 2,
        orderDate: '2026-06-20',
        customer: 'Nisha',
        totalAmount: 1798,
        status: 'Delivered',
      },
      {
        id: 'order-2',
        nurseryId: 'nursery-1',
        plantName: 'Snake Plant',
        quantity: 1,
        orderDate: '2026-06-18',
        customer: 'Arjun',
        totalAmount: 599,
        status: 'Packing',
      },
      {
        id: 'order-3',
        nurseryId: 'nursery-2',
        plantName: 'Fiddle Leaf Fig',
        quantity: 1,
        orderDate: '2026-06-17',
        customer: 'Shreya',
        totalAmount: 1299,
        status: 'Pending',
      },
      {
        id: 'order-4',
        nurseryId: 'nursery-3',
        plantName: 'Peace Lily',
        quantity: 3,
        orderDate: '2026-06-16',
        customer: 'Kavya',
        totalAmount: 2247,
        status: 'Delivered',
      },
      {
        id: 'order-5',
        nurseryId: 'nursery-3',
        plantName: 'ZZ Plant',
        quantity: 2,
        orderDate: '2026-06-15',
        customer: 'Mohan',
        totalAmount: 1298,
        status: 'Shipped',
      }
    ],
  };
}

export function getPortalState() {
  if (typeof window === 'undefined') {
    return seedPortalState();
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const initialState = seedPortalState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error('Portal state parse failed', error);
    const initialState = seedPortalState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }
}

export function savePortalState(state) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function authenticateNursery(email, password) {
  const state = getPortalState();
  return state.nurseries.find(
    (nursery) => nursery.email.toLowerCase() === email.toLowerCase() && nursery.password === password
  );
}

export function registerNursery(payload) {
  const state = getPortalState();
  const nursery = {
    id: `nursery-${Date.now()}`,
    ...payload,
    status: 'pending',
    isActive: false,
    rating: 4.5,
    location: payload.address.split(',')[0] || 'New City',
    revenue: 0,
    orders: 0,
    productsCount: 0,
  };

  state.nurseries = [nursery, ...state.nurseries];
  savePortalState(state);
  return nursery;
}

export function getNurseryProducts(nurseryId) {
  const state = getPortalState();
  return state.nurseryProducts.filter((product) => product.nurseryId === nurseryId);
}

export function getNurseryOrders(nurseryId) {
  const state = getPortalState();
  return state.nurseryOrders.filter((order) => order.nurseryId === nurseryId);
}

export function createNurseryProduct(nurseryId, product) {
  const state = getPortalState();
  const newProduct = {
    id: `product-${Date.now()}`,
    nurseryId,
    sales: 0,
    views: 0,
    wishlistCount: 0,
    trendingScore: 70,
    ...product,
  };
  state.nurseryProducts = [...state.nurseryProducts, newProduct];
  savePortalState(state);
  return newProduct;
}

export function updateNurseryProduct(productId, updates) {
  const state = getPortalState();
  state.nurseryProducts = state.nurseryProducts.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
  savePortalState(state);
  return state.nurseryProducts.find((product) => product.id === productId);
}

export function deleteNurseryProduct(productId) {
  const state = getPortalState();
  state.nurseryProducts = state.nurseryProducts.filter((product) => product.id !== productId);
  savePortalState(state);
}

export function toggleNurseryProductStatus(productId, availability) {
  return updateNurseryProduct(productId, { availability });
}

export function approveNursery(nurseryId) {
  const state = getPortalState();
  state.nurseries = state.nurseries.map((nursery) =>
    nursery.id === nurseryId ? { ...nursery, status: 'approved', isActive: true } : nursery
  );
  savePortalState(state);
}

export function rejectNursery(nurseryId) {
  const state = getPortalState();
  state.nurseries = state.nurseries.map((nursery) =>
    nursery.id === nurseryId ? { ...nursery, status: 'rejected', isActive: false } : nursery
  );
  savePortalState(state);
}

export function setNurseryActive(nurseryId, isActive) {
  const state = getPortalState();
  state.nurseries = state.nurseries.map((nursery) =>
    nursery.id === nurseryId ? { ...nursery, isActive } : nursery
  );
  savePortalState(state);
}
