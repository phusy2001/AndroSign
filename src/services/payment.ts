import Config from 'react-native-config';
import AxiosClient from './clients/api';

const client = new AxiosClient(`${Config.API_URL}:3004`);

export async function checkQuota() {
  return await client.get('/orders/checkUserPlan');
}

export async function getPlans() {
  return await client.get('/plans');
}

export async function getPlan(plan_id: string) {
  return await client.get(`/plans/${plan_id}`);
}

export async function createOrder(user_id: string, plan_id: string) {
  return await client.post('/orders', {user_id, plan_id});
}

export async function checkStatus(app_trans_id: string) {
  return await client.get(`/orders/status/${app_trans_id}`);
}

export async function updateStatus(app_trans_id: string) {
  return await client.post(`/orders/status/${app_trans_id}`);
}
