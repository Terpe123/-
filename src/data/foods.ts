export interface FoodItem {
  id: number;
  name: string;
  category: string;
  emoji: string;
  subtitle: string;
}

export const FOOD_LIST: FoodItem[] = [
  { id: 1, name: '牛肉麵', category: '麵食', emoji: '🍜', subtitle: '濃郁紅燒或清燉湯頭配厚切牛肉' },
  { id: 2, name: '滷肉飯', category: '飯食', emoji: '🍚', subtitle: '鹹香油亮肉燥淋上熱騰騰白飯' },
  { id: 3, name: '炒飯', category: '飯食', emoji: '🍳', subtitle: '粒粒分明鍋氣十足的黃金炒飯' },
  { id: 4, name: '炒麵', category: '麵食', emoji: '🍝', subtitle: '大火快炒肉絲高麗菜香氣四溢' },
  { id: 5, name: '水餃', category: '麵點', emoji: '🥟', subtitle: '皮薄餡多汁水飽滿的現煮水餃' },
  { id: 6, name: '鍋貼', category: '麵點', emoji: '🥟', subtitle: '金黃酥脆冰花底與香濃肉餡' },
  { id: 7, name: '拉麵', category: '日式', emoji: '🍜', subtitle: '濃郁豚骨或醬油湯底搭配叉燒' },
  { id: 8, name: '咖哩飯', category: '飯食', emoji: '🍛', subtitle: '香濃醇厚日式咖哩與軟嫩肉塊' },
  { id: 9, name: '便當', category: '台式', emoji: '🍱', subtitle: '排骨雞腿經典主菜配三樣豐富配菜' },
  { id: 10, name: '雞肉飯', category: '飯食', emoji: '🍗', subtitle: '鮮嫩雞肉絲淋上香醇蔥油雞汁' },
  { id: 11, name: '火鍋', category: '鍋物', emoji: '🍲', subtitle: '熱氣騰騰豐富肉盤與鮮甜時蔬' },
  { id: 12, name: '壽司', category: '日式', emoji: '🍣', subtitle: '鮮美生魚片與醋飯的完美平衡' },
  { id: 13, name: '漢堡', category: '美式', emoji: '🍔', subtitle: '厚實多汁肉排與融化起司生菜' },
  { id: 14, name: '披薩', category: '義式', emoji: '🍕', subtitle: '牽絲起司搭配酥脆現烤薄脆餅皮' },
  { id: 15, name: '義大利麵', category: '義式', emoji: '🍝', subtitle: '彈牙麵條裹滿濃郁白醬或紅醬' },
  { id: 16, name: '韓式拌飯', category: '韓式', emoji: '🥣', subtitle: '熱石鍋煎出鍋巴拌入辣醬與時蔬' },
];
