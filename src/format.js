// 轉換成千分位
export default num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
