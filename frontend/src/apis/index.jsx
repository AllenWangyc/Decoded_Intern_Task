import { request } from '@/utils/request';

export function generateAPI(data) {
  return request({
    url: '/api/extract',
    method: 'POST',
    data: data
  });
}