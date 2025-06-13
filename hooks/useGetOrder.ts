import { useEffect, useState } from 'react';
import { useSubscription } from '@apollo/client';
import { ORDER_CONFIRMED_FOR_SHIPPERS } from '@/src/graphql/subscriptions/orderSubscription';
import { router } from 'expo-router';

interface Location {
  latitude: string;
  longitude: string;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  restaurant: {
    id: string;
    name: string;
    latitude?: string;
    longitude?: string;
    address?: {
      street: string;
      ward: string;
      district: string;
      city: string;
    };
  };
  user: {
    id: string;
    name: string;
    phone: string;
  };
  distanceFromShipper: number;
  address: {
    street: string;
    ward: string;
    district: string;
    city: string;
    latitude?: string;
    longitude?: string;
  };
  orderDetails: Array<{
    id: string;
    quantity: number;
    food: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
}

function haversineDistance(
    coord1: { lat: number; lon: number },
    coord2: { lat: number; lon: number }
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth radius in km
  
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLon = toRad(coord2.lon - coord1.lon);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c;
  }
  

  export function useOrderConfirmedForShipper(
    location: Location,
    maxDistance: number = 9999,
    enable: boolean = false
  ) {
    const [newOrders, setNewOrders] = useState<Order[]>([]);
  
    console.log('[📍 useOrderConfirmedForShipper] Location:', location);
    console.log('[🚦 useOrderConfirmedForShipper] Enabled:', enable);
  
    const { loading, error } = useSubscription(ORDER_CONFIRMED_FOR_SHIPPERS, {
      variables: {
        latitude: location.latitude,
        longitude: location.longitude,
        maxDistance,
      },
      skip: !enable || !location.latitude || !location.longitude,
      onData: ({ data }) => {
        console.log('[📡 Subscription Triggered] Raw data:', data);
  
        const newOrder = data?.data?.orderConfirmedForShippers;
        console.log('[📦 Order received]', newOrder?.address);
        console.log('[📍 Lat/Lng]', newOrder?.address.latitude, newOrder?.address.longitude);
  
        if (newOrder) {
          const orderLat = parseFloat(newOrder.address.latitude);
          const orderLon = parseFloat(newOrder.address.longitude);
          const shipperLat = parseFloat(location.latitude);
          const shipperLon = parseFloat(location.longitude);
  
          const distance = haversineDistance(
            { lat: shipperLat, lon: shipperLon },
            { lat: orderLat, lon: orderLon }
          );
  
          const enrichedOrder: Order = {
            ...newOrder,
            distanceFromShipper: distance,
          };
  
          console.log('[✅ New Order Received]', enrichedOrder);
          setNewOrders(prev => [enrichedOrder, ...prev]);
        } else {
          console.log('[⚠️ No new order in payload]');
        }
      },
    });
  
    useEffect(() => {
      if (error) {
        console.error('[❌ Subscription Error]', error);
        router.push('/phone');
      }
    }, [error]);
  
    return {
      newOrders,
      loading,
      error,
      clearNewOrders: () => {
        console.log('[🧹 Clear New Orders]');
        setNewOrders([]);
      },
      enable,
    };
  }
