const foodDatabase = [
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "food_item": "Butter Chicken",
    "serving_size": "1 cup (240g)",
    "calories_per_serve": 490
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "food_item": "Paneer Tikka",
    "serving_size": "100g (3-4 pieces)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "food_item": "Dal Makhani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "food_item": "Aloo Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 290
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "food_item": "Samosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440006",
    "food_item": "Biryani (Chicken)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440007",
    "food_item": "Idli",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 70
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440008",
    "food_item": "Dosa (Plain)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440009",
    "food_item": "Chole Bhature",
    "serving_size": "1 plate (1 bhature + 1 cup chole)",
    "calories_per_serve": 500
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "food_item": "Pav Bhaji",
    "serving_size": "1 plate (2 pav + 1 cup bhaji)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440011",
    "food_item": "Raita",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440012",
    "food_item": "Gulab Jamun",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440013",
    "food_item": "Pulao (Vegetable)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440014",
    "food_item": "Tandoori Roti",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440015",
    "food_item": "Palak Paneer",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440016",
    "food_item": "Butter Chicken",
    "serving_size": "1 cup (240g)",
    "calories_per_serve": 490
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440017",
    "food_item": "Paneer Tikka",
    "serving_size": "100g (3-4 pieces)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440018",
    "food_item": "Dal Makhani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440019",
    "food_item": "Aloo Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 290
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440020",
    "food_item": "Samosa (Vegetable)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440021",
    "food_item": "Chicken Biryani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440022",
    "food_item": "Idli",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 70
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440023",
    "food_item": "Plain Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440024",
    "food_item": "Chole Bhature",
    "serving_size": "1 plate (1 bhature + 1 cup chole)",
    "calories_per_serve": 500
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440025",
    "food_item": "Pav Bhaji",
    "serving_size": "1 plate (2 pav + 1 cup bhaji)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440026",
    "food_item": "Raita (Cucumber)",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440027",
    "food_item": "Gulab Jamun",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440028",
    "food_item": "Vegetable Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440029",
    "food_item": "Tandoori Roti",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440030",
    "food_item": "Palak Paneer",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440031",
    "food_item": "Rogan Josh (Mutton)",
    "serving_size": "1 cup (240g)",
    "calories_per_serve": 450
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440032",
    "food_item": "Vada Pav",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440033",
    "food_item": "Masala Dosa",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440034",
    "food_item": "Rajma Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440035",
    "food_item": "Pani Puri",
    "serving_size": "6 pieces (120g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440036",
    "food_item": "Jalebi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440037",
    "food_item": "Tandoori Chicken",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440038",
    "food_item": "Sambar",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440039",
    "food_item": "Rasam",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440040",
    "food_item": "Kheer",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440041",
    "food_item": "Naan (Butter)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440042",
    "food_item": "Pongal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440043",
    "food_item": "Fish Curry (Bengali)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440044",
    "food_item": "Aloo Gobi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440045",
    "food_item": "Misal Pav",
    "serving_size": "1 plate (1 cup misal + 2 pav)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440046",
    "food_item": "Rasgulla",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440047",
    "food_item": "Upma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440048",
    "food_item": "Prawn Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440049",
    "food_item": "Bhindi Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440050",
    "food_item": "Kachori",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440051",
    "food_item": "Dhokla",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440052",
    "food_item": "Malai Kofta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440053",
    "food_item": "Pesarattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440054",
    "food_item": "Litti Chokha",
    "serving_size": "1 plate (2 litti + 1 cup chokha)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440055",
    "food_item": "Mysore Pak",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440056",
    "food_item": "Baingan Bharta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440057",
    "food_item": "Mutton Biryani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 330
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440058",
    "food_item": "Puri",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440059",
    "food_item": "Shrikhand",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440060",
    "food_item": "Kadhi Pakora",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440061",
    "food_item": "Veg Kolhapuri",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440062",
    "food_item": "Appam",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440063",
    "food_item": "Chicken 65",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 290
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440064",
    "food_item": "Medu Vada",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440065",
    "food_item": "Barfi (Milk)",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440066",
    "food_item": "Pork Vindaloo",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440067",
    "food_item": "Sev Puri",
    "serving_size": "6 pieces (120g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440068",
    "food_item": "Methi Thepla",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440069",
    "food_item": "Mutton Korma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440070",
    "food_item": "Uttapam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440071",
    "food_item": "Laddu (Besan)",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440072",
    "food_item": "Chana Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440073",
    "food_item": "Veg Jalfrezi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440074",
    "food_item": "Prawn Biryani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440075",
    "food_item": "Parotta",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440076",
    "food_item": "Rabri",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440077",
    "food_item": "Aloo Tikki",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440078",
    "food_item": "Chicken Chettinad",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440079",
    "food_item": "Poha",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440080",
    "food_item": "Sandesh",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440081",
    "food_item": "Keema Matar",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440082",
    "food_item": "Bhel Puri",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440083",
    "food_item": "Kozhukattai",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440084",
    "food_item": "Dahi Vada",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440085",
    "food_item": "Mushroom Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440086",
    "food_item": "Kulfi",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440087",
    "food_item": "Amritsari Fish",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440088",
    "food_item": "Chakli",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440089",
    "food_item": "Goan Fish Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440090",
    "food_item": "Khichdi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440091",
    "food_item": "Pesarattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440092",
    "food_item": "Modak",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440093",
    "food_item": "Veg Korma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440094",
    "food_item": "Prawn Malai Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440095",
    "food_item": "Poori Masala",
    "serving_size": "1 plate (2 poori + 1 cup masala)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440096",
    "food_item": "Halwa (Sooji)",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440097",
    "food_item": "Chicken Tikka Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440098",
    "food_item": "Pesarattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440099",
    "food_item": "Luchi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "food_item": "Matar Paneer",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440101",
    "food_item": "Papdi Chaat",
    "serving_size": "1 plate (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440102",
    "food_item": "Thalipeeth",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440103",
    "food_item": "Mutton Do Pyaza",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440104",
    "food_item": "Rava Idli",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 90
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440105",
    "food_item": "Prawn Balchao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440106",
    "food_item": "Chivda",
    "serving_size": "1 cup (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440107",
    "food_item": "Egg Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440108",
    "food_item": "Puran Poli",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440109",
    "food_item": "Doi Maach",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440110",
    "food_item": "Khandvi",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440111",
    "food_item": "Shahi Paneer",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440112",
    "food_item": "Bisi Bele Bath",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440113",
    "food_item": "Phirni",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440114",
    "food_item": "Kadai Chicken",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440115",
    "food_item": "Gobi Manchurian",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440116",
    "food_item": "Dal Tadka",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440117",
    "food_item": "Methi Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440118",
    "food_item": "Samosa (Keema)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440119",
    "food_item": "Vegetable Biryani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440120",
    "food_item": "Rava Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440121",
    "food_item": "Onion Uthappam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440122",
    "food_item": "Pindi Chole",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440123",
    "food_item": "Dahi Puri",
    "serving_size": "6 pieces (120g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440124",
    "food_item": "Kaju Katli",
    "serving_size": "1 piece (25g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440125",
    "food_item": "Tandoori Fish",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440126",
    "food_item": "Coconut Chutney",
    "serving_size": "2 tbsp (30g)",
    "calories_per_serve": 60
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440127",
    "food_item": "Tomato Rasam",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 70
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440128",
    "food_item": "Carrot Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440129",
    "food_item": "Garlic Naan",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440130",
    "food_item": "Ven Pongal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440131",
    "food_item": "Macher Jhol",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440132",
    "food_item": "Aloo Matar",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440133",
    "food_item": "Ragda Patties",
    "serving_size": "1 plate (2 patties + 1 cup ragda)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440134",
    "food_item": "Peda",
    "serving_size": "1 piece (30g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440135",
    "food_item": "Sabudana Khichdi",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440136",
    "food_item": "Fish Fry (Kerala Style)",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440137",
    "food_item": "Paneer Butter Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440138",
    "food_item": "Pav Bhaji (No Butter)",
    "serving_size": "1 plate (2 pav + 1 cup bhaji)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440139",
    "food_item": "Masala Vada",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440140",
    "food_item": "Hyderabadi Biryani (Mutton)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440141",
    "food_item": "Poori",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440142",
    "food_item": "Mango Lassi",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440143",
    "food_item": "Aloo Bhindi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 170
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440144",
    "food_item": "Thepla",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440145",
    "food_item": "Chicken Korma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 390
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440146",
    "food_item": "Set Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440147",
    "food_item": "Motichoor Laddu",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440148",
    "food_item": "Dal Fry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440149",
    "food_item": "Bonda",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440150",
    "food_item": "Dum Aloo",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440151",
    "food_item": "Chicken Saag",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 330
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440152",
    "food_item": "Pesarattu with Upma",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440153",
    "food_item": "Anarsa",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440154",
    "food_item": "Lauki Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440155",
    "food_item": "Kolkata Egg Roll",
    "serving_size": "1 roll (150g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440156",
    "food_item": "Rava Kesari",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440157",
    "food_item": "Paneer Bhurji",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440158",
    "food_item": "Masala Chai",
    "serving_size": "1 cup (150ml)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440159",
    "food_item": "Mutton Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440160",
    "food_item": "Rava Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440161",
    "food_item": "Chhena Poda",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440162",
    "food_item": "Prawn Korma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440163",
    "food_item": "Aloo Chaat",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440164",
    "food_item": "Puliogare",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440165",
    "food_item": "Paneer Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440166",
    "food_item": "Balushahi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440167",
    "food_item": "Egg Bhurji",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440168",
    "food_item": "Veg Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440169",
    "food_item": "Adai",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440170",
    "food_item": "Prawn Fry",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440171",
    "food_item": "Besan Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440172",
    "food_item": "Kadala Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440173",
    "food_item": "Seviyan Kheer",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440174",
    "food_item": "Chicken Vindaloo",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440175",
    "food_item": "Akki Roti",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440176",
    "food_item": "Dabeli",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440177",
    "food_item": "Sooji Dhokla",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 90
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440178",
    "food_item": "Mutton Rogan Josh",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440179",
    "food_item": "Lemon Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440180",
    "food_item": "Malpua",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440181",
    "food_item": "Palak Dal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440182",
    "food_item": "Chicken Lollipop",
    "serving_size": "2 pieces (100g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440183",
    "food_item": "Patra",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440184",
    "food_item": "Fish Amritsari",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 290
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440185",
    "food_item": "Veg Kurma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440186",
    "food_item": "Ghevar",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440187",
    "food_item": "Sabudana Vada",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440188",
    "food_item": "Mutton Keema",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440189",
    "food_item": "Curd Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440190",
    "food_item": "Prawn Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440191",
    "food_item": "Khaman",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440192",
    "food_item": "Chicken Patiala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440193",
    "food_item": "Masala Poori",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440194",
    "food_item": "Badam Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440195",
    "food_item": "Aloo Posto",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440196",
    "food_item": "Paneer Pasanda",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440197",
    "food_item": "Kothu Parotta",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440198",
    "food_item": "Boondi Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440199",
    "food_item": "Avial",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440200",
    "food_item": "Chicken Manchurian",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440201",
    "food_item": "Pesarattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440202",
    "food_item": "Prawn Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440203",
    "food_item": "Rava Laddu",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440204",
    "food_item": "Veg Manchurian",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440205",
    "food_item": "Bhakarwadi",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440206",
    "food_item": "Mutton Biryani (Lucknowi)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440207",
    "food_item": "Pongal (Sweet)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440208",
    "food_item": "Dahi Bhalla",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440209",
    "food_item": "Paneer Makhani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440210",
    "food_item": "Coconut Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440211",
    "food_item": "Jhal Muri",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440212",
    "food_item": "Chicken Do Pyaza",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440213",
    "food_item": "Ragi Roti",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440214",
    "food_item": "Laal Maas",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440215",
    "food_item": "Veg Hakka Noodles",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440216",
    "food_item": "Moong Dal Chilla",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440217",
    "food_item": "Gobi Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440218",
    "food_item": "Samosa (Chicken)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 290
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440219",
    "food_item": "Jeera Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440220",
    "food_item": "Neer Dosa",
    "serving_size": "1 piece (80g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440221",
    "food_item": "Tomato Uthappam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440222",
    "food_item": "Amritsari Chole",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440223",
    "food_item": "Ragda Puri",
    "serving_size": "6 pieces (120g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440224",
    "food_item": "Rasmalai",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440225",
    "food_item": "Tandoori Prawn",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440226",
    "food_item": "Mint Chutney",
    "serving_size": "2 tbsp (30g)",
    "calories_per_serve": 40
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440227",
    "food_item": "Pepper Rasam",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440228",
    "food_item": "Beetroot Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440229",
    "food_item": "Keema Naan",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440230",
    "food_item": "Khara Pongal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440231",
    "food_item": "Shorshe Ilish",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440232",
    "food_item": "Aloo Palak",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440233",
    "food_item": "Kanda Bhaji",
    "serving_size": "1 plate (4 pieces, 100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440234",
    "food_item": "Mawa Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440235",
    "food_item": "Sabudana Tikki",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440236",
    "food_item": "Chicken Fry (Andhra Style)",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440237",
    "food_item": "Paneer Kadai",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440238",
    "food_item": "Vada (Urad Dal)",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 110
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440239",
    "food_item": "Hyderabadi Chicken Biryani",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 330
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440240",
    "food_item": "Missi Roti",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440241",
    "food_item": "Buttermilk (Chaas)",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440242",
    "food_item": "Baingan Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440243",
    "food_item": "Undhiyu",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440244",
    "food_item": "Chicken Seekh Kebab",
    "serving_size": "2 pieces (100g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440245",
    "food_item": "Oats Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440246",
    "food_item": "Coconut Burfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440247",
    "food_item": "Dal Baati",
    "serving_size": "1 plate (2 baati + 1 cup dal)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440248",
    "food_item": "Prawn Tikka",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440249",
    "food_item": "Kachumber Salad",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 50
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440250",
    "food_item": "Mutton Kheema Pav",
    "serving_size": "1 plate (1 cup kheema + 2 pav)",
    "calories_per_serve": 450
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440251",
    "food_item": "Rava Pongal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440252",
    "food_item": "Mysore Masala Dosa",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440253",
    "food_item": "Badam Milk",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440254",
    "food_item": "Chana Chaat",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440255",
    "food_item": "Fish Tikka",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440256",
    "food_item": "Methi Malai Matar",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
		
    {
    "id": "550e8400-e29b-41d4-a716-446655440301",
    "food_item": "Masala Papad",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440302",
    "food_item": "Chicken Kolhapuri",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440303",
    "food_item": "Pesarattu with Chutney",
    "serving_size": "1 piece (100g + 2 tbsp chutney)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440304",
    "food_item": "Gajar Ka Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440305",
    "food_item": "Veg Kheema",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440306",
    "food_item": "Prawn Bhuna",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440307",
    "food_item": "Masala Omelette",
    "serving_size": "2 eggs (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440308",
    "food_item": "Tamarind Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440309",
    "food_item": "Paneer Kulcha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440310",
    "food_item": "Soan Papdi",
    "serving_size": "1 piece (30g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440311",
    "food_item": "Egg Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440312",
    "food_item": "Mushroom Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440313",
    "food_item": "Davanagere Benne Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440314",
    "food_item": "Prawn Vindaloo",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440315",
    "food_item": "Atta Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440316",
    "food_item": "Kerala Chicken Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440317",
    "food_item": "Veg Fried Rice",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440318",
    "food_item": "Murukku",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440319",
    "food_item": "Mutton Saag",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440320",
    "food_item": "Jowar Roti",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440321",
    "food_item": "Sev Tamatar",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440322",
    "food_item": "Paneer Do Pyaza",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440323",
    "food_item": "Benne Seedai",
    "serving_size": "1 cup (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440324",
    "food_item": "Chicken Xacuti",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440325",
    "food_item": "Pesarattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440326",
    "food_item": "Mysore Bonda",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440327",
    "food_item": "Pavakka Fry",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440328",
    "food_item": "Chum Chum",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440329",
    "food_item": "Matar Mushroom",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440330",
    "food_item": "Fish Moilee",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440331",
    "food_item": "Kothimbir Vadi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440332",
    "food_item": "Paneer Jalfrezi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440333",
    "food_item": "Sambar Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440334",
    "food_item": "Pista Kulfi",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440335",
    "food_item": "Chicken Malai Tikka",
    "serving_size": "100g (3-4 pieces)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440336",
    "food_item": "Poha Chivda",
    "serving_size": "1 cup (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440337",
    "food_item": "Mutton Vindaloo",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440338",
    "food_item": "Bajra Roti",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440339",
    "food_item": "Veg Kofta Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440340",
    "food_item": "Mango Burfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440341",
    "food_item": "Prawn Chettinad",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440342",
    "food_item": "Corn Chaat",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440343",
    "food_item": "Chicken Pepper Fry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440344",
    "food_item": "Ragi Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440345",
    "food_item": "Puran Poli (Maharashtrian)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440346",
    "food_item": "Aloo Methi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440347",
    "food_item": "Sooji Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440348",
    "food_item": "Fish Kalia",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440349",
    "food_item": "Pav (Bun)",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440350",
    "food_item": "Paneer Tikka Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440351",
    "food_item": "Bisibele Bath",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440352",
    "food_item": "Gulab Phirni",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440353",
    "food_item": "Mutton Sukka",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440354",
    "food_item": "Methi Puri",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440355",
    "food_item": "Pork Sorpotel",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440356",
    "food_item": "Veg Chowmein",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440357",
    "food_item": "Besan Chilla",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440358",
    "food_item": "Mooli Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440359",
    "food_item": "Samosa (Paneer)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440360",
    "food_item": "Saffron Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440361",
    "food_item": "Ragi Idli",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440362",
    "food_item": "Mixed Vegetable Uthappam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440363",
    "food_item": "Punjabi Chole",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440364",
    "food_item": "Sev Puri",
    "serving_size": "6 pieces (120g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440365",
    "food_item": "Imarti",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440366",
    "food_item": "Tandoori Mutton Chops",
    "serving_size": "100g (2 pieces)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440367",
    "food_item": "Tamarind Chutney",
    "serving_size": "2 tbsp (30g)",
    "calories_per_serve": 50
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440368",
    "food_item": "Garlic Rasam",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 70
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440369",
    "food_item": "Pumpkin Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440370",
    "food_item": "Cheese Naan",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 330
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440371",
    "food_item": "Sambar Vada",
    "serving_size": "1 piece (100g + 1 cup sambar)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440372",
    "food_item": "Chingri Malai Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440373",
    "food_item": "Cabbage Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440374",
    "food_item": "Pav Bhaji (Street Style)",
    "serving_size": "1 plate (2 pav + 1 cup bhaji)",
    "calories_per_serve": 420
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440375",
    "food_item": "Milk Peda",
    "serving_size": "1 piece (30g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440376",
    "food_item": "Sabudana Kheer",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440377",
    "food_item": "Fish Fry (Andhra Style)",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440378",
    "food_item": "Paneer Lababdar",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440379",
    "food_item": "Idli Sambar",
    "serving_size": "1 plate (2 idlis + 1 cup sambar)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440380",
    "food_item": "Kashmiri Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440381",
    "food_item": "Kulcha",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440382",
    "food_item": "Rose Lassi",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440383",
    "food_item": "Tindora Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440384",
    "food_item": "Pithla",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440385",
    "food_item": "Mutton Seekh Kebab",
    "serving_size": "2 pieces (100g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440386",
    "food_item": "Vermicelli Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440387",
    "food_item": "Coconut Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440388",
    "food_item": "Chole Kulche",
    "serving_size": "1 plate (1 kulcha + 1 cup chole)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440389",
    "food_item": "Prawn Tandoori",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440390",
    "food_item": "Sprouts Salad",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 60
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440391",
    "food_item": "Keema Pav",
    "serving_size": "1 plate (1 cup keema + 2 pav)",
    "calories_per_serve": 450
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440392",
    "food_item": "Rava Idli Sambar",
    "serving_size": "1 plate (2 idlis + 1 cup sambar)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440393",
    "food_item": "Cheese Dosa",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440394",
    "food_item": "Saffron Lassi",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440395",
    "food_item": "Corn Chaat",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440396",
    "food_item": "Fish Pakora",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440397",
    "food_item": "Palak Kofta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440398",
    "food_item": "Roasted Papad",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 60
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440399",
    "food_item": "Chicken Handi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440400",
    "food_item": "Adai with Chutney",
    "serving_size": "1 piece (100g + 2 tbsp chutney)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440401",
    "food_item": "Moong Dal Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440402",
    "food_item": "Soya Chaap Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440403",
    "food_item": "Prawn Sukka",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440404",
    "food_item": "Masala Egg Bhurji",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440405",
    "food_item": "Curd Rice with Pickle",
    "serving_size": "1 cup (200g + 1 tbsp pickle)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440406",
    "food_item": "Onion Kulcha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440407",
    "food_item": "Petha",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440408",
    "food_item": "Egg Vindaloo",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440409",
    "food_item": "Peas Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440410",
    "food_item": "Oats Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440411",
    "food_item": "Prawn Pepper Fry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440412",
    "food_item": "Til Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440413",
    "food_item": "Kerala Mutton Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440414",
    "food_item": "Chicken Fried Rice",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440415",
    "food_item": "Thattai",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 90
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440416",
    "food_item": "Paneer Saag",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440417",
    "food_item": "Makki Ki Roti",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440418",
    "food_item": "Lauki Kofta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440419",
    "food_item": "Kesar Peda",
    "serving_size": "1 piece (30g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440420",
    "food_item": "Crab Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440421",
    "food_item": "Moong Dal Vada",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440422",
    "food_item": "Chicken Sukka",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440423",
    "food_item": "Ragi Mudde",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440424",
    "food_item": "Veg Cutlet",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440425",
    "food_item": "Kalakand",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440426",
    "food_item": "Matar Kulcha",
    "serving_size": "1 plate (1 kulcha + 1 cup matar)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440427",
    "food_item": "Fish Curry (Malabar Style)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440428",
    "food_item": "Poha Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440429",
    "food_item": "Paneer Achari",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440430",
    "food_item": "Veg Pongal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440431",
    "food_item": "Mango Kulfi",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440432",
    "food_item": "Chicken Afghani",
    "serving_size": "100g (2-3 pieces)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440433",
    "food_item": "Sev Murmura",
    "serving_size": "1 cup (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440434",
    "food_item": "Mutton Bhuna",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 370
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440435",
    "food_item": "Bajra Khichdi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440436",
    "food_item": "Soya Chaap Tikka",
    "serving_size": "100g (3-4 pieces)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440437",
    "food_item": "Anjeer Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440438",
    "food_item": "Prawn Balchao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440439",
    "food_item": "Sprouts Chaat",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440440",
    "food_item": "Chicken Bharta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440441",
    "food_item": "Ragi Uttapam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440442",
    "food_item": "Obbattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440443",
    "food_item": "Gobi Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440444",
    "food_item": "Pista Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440445",
    "food_item": "Fish Paturi",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440446",
    "food_item": "Aloo Kulcha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440447",
    "food_item": "Kesar Phirni",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440448",
    "food_item": "Mutton Pepper Fry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440449",
    "food_item": "Palak Puri",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440450",
    "food_item": "Chicken Rogan Josh",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440451",
    "food_item": "Veg Schezwan Noodles",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440452",
    "food_item": "Oats Chilla",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440453",
    "food_item": "Onion Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440454",
    "food_item": "Samosa (Potato and Peas)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440455",
    "food_item": "Coconut Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440456",
    "food_item": "Oats Idli",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440457",
    "food_item": "Cheese Uthappam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440458",
    "food_item": "Rajma Chawal",
    "serving_size": "1 plate (1 cup rajma + 1 cup rice)",
    "calories_per_serve": 400
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440459",
    "food_item": "Bhel Puri (Dry)",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440460",
    "food_item": "Cham Cham",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440461",
    "food_item": "Tandoori Pomfret",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440462",
    "food_item": "Green Chutney",
    "serving_size": "2 tbsp (30g)",
    "calories_per_serve": 40
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440463",
    "food_item": "Lemon Rasam",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 70
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440464",
    "food_item": "Coconut Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440465",
    "food_item": "Stuffed Naan",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440466",
    "food_item": "Idli Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440467",
    "food_item": "Rui Macher Kalia",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440468",
    "food_item": "Mix Veg Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440469",
    "food_item": "Batata Vada",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440470",
    "food_item": "Pista Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440471",
    "food_item": "Sabudana Thalipeeth",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440472",
    "food_item": "Fish Fry (Goan Style)",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440473",
    "food_item": "Paneer Malai Kofta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440474",
    "food_item": "Dosa with Sambar",
    "serving_size": "1 piece (100g + 1 cup sambar)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440475",
    "food_item": "Tehri",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440476",
    "food_item": "Amritsari Kulcha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440477",
    "food_item": "Kesar Lassi",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440478",
    "food_item": "Arbi Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 170
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440479",
    "food_item": "Zunka",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440480",
    "food_item": "Paneer Seekh Kebab",
    "serving_size": "2 pieces (100g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440481",
    "food_item": "Broken Wheat Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440482",
    "food_item": "Nariyal Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440483",
    "food_item": "Dal Baati Churma",
    "serving_size": "1 plate (2 baati + 1 cup dal + 50g churma)",
    "calories_per_serve": 450
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440484",
    "food_item": "Prawn Pakora",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440485",
    "food_item": "Cucumber Salad",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 40
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440486",
    "food_item": "Misal Pav (Spicy)",
    "serving_size": "1 plate (1 cup misal + 2 pav)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440487",
    "food_item": "Rava Dosa with Chutney",
    "serving_size": "1 piece (100g + 2 tbsp chutney)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440488",
    "food_item": "Paper Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440489",
    "food_item": "Mango Shrikhand",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440490",
    "food_item": "Sprouts Poha",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440491",
    "food_item": "Prawn Pakoda",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440492",
    "food_item": "Matar Paneer Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440493",
    "food_item": "Urad Dal Papad",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 60
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440494",
    "food_item": "Chicken Achari",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440495",
    "food_item": "Neer Dosa with Chutney",
    "serving_size": "1 piece (80g + 2 tbsp chutney)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440496",
    "food_item": "Rava Kesari Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440497",
    "food_item": "Soya Chaap Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440498",
    "food_item": "Crab Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440499",
    "food_item": "Masala Dosa with Potato Filling",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440500",
    "food_item": "Sesame Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440501",
    "food_item": "Aloo Stuffed Kulcha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 310
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440502",
    "food_item": "Mathri",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440503",
    "food_item": "Egg Korma",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440504",
    "food_item": "Paneer Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440505",
    "food_item": "Wheat Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440506",
    "food_item": "Prawn Koliwada",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440507",
    "food_item": "Coconut Ladoo (No Sugar)",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440508",
    "food_item": "Kerala Fish Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440509",
    "food_item": "Prawn Fried Rice",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440510",
    "food_item": "Namak Para",
    "serving_size": "1 cup (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440511",
    "food_item": "Mushroom Kadai",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440512",
    "food_item": "Jowar Bhakri",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440513",
    "food_item": "Gobi Manchurian Dry",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440514",
    "food_item": "Saffron Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440515",
    "food_item": "Squid Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440516",
    "food_item": "Sabudana Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440517",
    "food_item": "Chicken Pasanda",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440518",
    "food_item": "Ragi Porridge",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440519",
    "food_item": "Aloo Poha",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440520",
    "food_item": "Kaju Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440521",
    "food_item": "Pav Bhaji (Jain)",
    "serving_size": "1 plate (2 pav + 1 cup bhaji)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440522",
    "food_item": "Pomfret Fry",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440523",
    "food_item": "Methi Matar Malai",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440524",
    "food_item": "Veg Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 170
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440525",
    "food_item": "Mango Phirni",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440526",
    "food_item": "Mutton Achari",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 370
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440527",
    "food_item": "Beetroot Puri",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440528",
    "food_item": "Paneer Bharta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440529",
    "food_item": "Bisi Bele Bath (Jain)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440530",
    "food_item": "Sev Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440531",
    "food_item": "Chicken Kheema Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440532",
    "food_item": "Methi Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440533",
    "food_item": "Pesarattu with Upma",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440534",
    "food_item": "Mushroom Bhaji",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440535",
    "food_item": "Fish Curry (Mangalorean)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440536",
    "food_item": "Puran Poli (Gujarati)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440537",
    "food_item": "Badam Kheer",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440538",
    "food_item": "Chicken Tikka",
    "serving_size": "100g (3-4 pieces)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440539",
    "food_item": "Corn Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440540",
    "food_item": "Masala Vada",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 120
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440541",
    "food_item": "Butter Paneer",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440542",
    "food_item": "Manchurian Fried Rice",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440543",
    "food_item": "Rava Chilla",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440544",
    "food_item": "Palak Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440545",
    "food_item": "Samosa (Mutton)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440546",
    "food_item": "Mint Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440547",
    "food_item": "Barley Idli",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440548",
    "food_item": "Paneer Uthappam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440549",
    "food_item": "Kadhi Chawal",
    "serving_size": "1 plate (1 cup kadhi + 1 cup rice)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440550",
    "food_item": "Sukhi Bhel",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440551",
    "food_item": "Malai Peda",
    "serving_size": "1 piece (30g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440552",
    "food_item": "Tandoori Surmai",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440553",
    "food_item": "Peanut Chutney",
    "serving_size": "2 tbsp (30g)",
    "calories_per_serve": 80
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440554",
    "food_item": "Mysore Rasam",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 70
  },
  
  {
    "id": "550e8400-e29b-41d4-a716-446655440556",
    "food_item": "Lauki Halwa",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440557",
    "food_item": "Peshawari Naan",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440558",
    "food_item": "Masala Pongal",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440559",
    "food_item": "Bengali Fish Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440560",
    "food_item": "Chana Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440561",
    "food_item": "Onion Pakoda",
    "serving_size": "1 plate (4 pieces, 100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440562",
    "food_item": "Besan Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440563",
    "food_item": "Sabudana Pakoda",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440564",
    "food_item": "Fish Fry (Tamil Nadu Style)",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440565",
    "food_item": "Paneer Handi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440566",
    "food_item": "Idli Fry",
    "serving_size": "1 plate (2 idlis, 100g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440567",
    "food_item": "Veg Yakhni Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440568",
    "food_item": "Laccha Paratha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440569",
    "food_item": "Sweet Lassi",
    "serving_size": "1 glass (200ml)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440570",
    "food_item": "Parwal Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440571",
    "food_item": "Bhakri",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440572",
    "food_item": "Fish Seekh Kebab",
    "serving_size": "2 pieces (100g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440573",
    "food_item": "Quinoa Upma",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440574",
    "food_item": "Mawa Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440575",
    "food_item": "Gatte Ki Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440576",
    "food_item": "Prawn Hariyali",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440577",
    "food_item": "Onion Salad",
    "serving_size": "1 cup (100g)",
    "calories_per_serve": 40
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440578",
    "food_item": "Vada Pav (Street Style)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440579",
    "food_item": "Rava Idli with Chutney",
    "serving_size": "1 plate (2 idlis + 2 tbsp chutney)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440580",
    "food_item": "Onion Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440581",
    "food_item": "Pista Shrikhand",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440582",
    "food_item": "Moong Dal Poha",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440583",
    "food_item": "Chicken Pakoda",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440584",
    "food_item": "Soya Chaap Kadai",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440585",
    "food_item": "Masala Papad (Fried)",
    "serving_size": "1 piece (20g)",
    "calories_per_serve": 100
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440586",
    "food_item": "Mutton Handi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440587",
    "food_item": "Set Dosa with Chutney",
    "serving_size": "1 piece (100g + 2 tbsp chutney)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440588",
    "food_item": "Pineapple Kesari",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440589",
    "food_item": "Veg Malai Kofta",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440590",
    "food_item": "Squid Fry",
    "serving_size": "100g (4-5 pieces)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440591",
    "food_item": "Masala Egg Omelette",
    "serving_size": "2 eggs (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440592",
    "food_item": "Garlic Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440593",
    "food_item": "Cheese Kulcha",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 320
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440594",
    "food_item": "Doodh Peda",
    "serving_size": "1 piece (30g)",
    "calories_per_serve": 130
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440595",
    "food_item": "Egg Do Pyaza",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440596",
    "food_item": "Matar Pulao",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440597",
    "food_item": "Jowar Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440598",
    "food_item": "Prawn Achari",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 290
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440599",
    "food_item": "Rava Ladoo",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440600",
    "food_item": "Andhra Chicken Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440601",
    "food_item": "Egg Fried Rice",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 230
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440602",
    "food_item": "Shakkar Para",
    "serving_size": "1 cup (50g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440603",
    "food_item": "Soya Chaap Butter Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440604",
    "food_item": "Bajra Bhakri",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440605",
    "food_item": "Mushroom Manchurian",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440606",
    "food_item": "Almond Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440607",
    "food_item": "Clam Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440608",
    "food_item": "Barley Dosa",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 160
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440609",
    "food_item": "Mutton Kheema Curry",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 360
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440610",
    "food_item": "Oats Porridge",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440611",
    "food_item": "Veg Poha",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 180
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440612",
    "food_item": "Til Barfi",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440613",
    "food_item": "Jain Pav Bhaji",
    "serving_size": "1 plate (2 pav + 1 cup bhaji)",
    "calories_per_serve": 380
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440614",
    "food_item": "Sardine Fry",
    "serving_size": "100g (1 piece)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440615",
    "food_item": "Kaddu Ki Sabzi",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 150
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440616",
    "food_item": "Rava Uttapam",
    "serving_size": "1 piece (150g)",
    "calories_per_serve": 200
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440617",
    "food_item": "Kesar Kheer",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 280
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440618",
    "food_item": "Chicken Bhuna Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 350
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440619",
    "food_item": "Tomato Rice",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 210
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440620",
    "food_item": "Methi Pesarattu",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440621",
    "food_item": "Palak Mushroom",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 190
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440622",
    "food_item": "Fish Curry (Kerala Style)",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 270
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440623",
    "food_item": "Puran Poli (Karnataka Style)",
    "serving_size": "1 piece (100g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440624",
    "food_item": "Pista Kheer",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 300
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440625",
    "food_item": "Chicken Hariyali Tikka",
    "serving_size": "100g (3-4 pieces)",
    "calories_per_serve": 240
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440626",
    "food_item": "Mushroom Fried Rice",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 220
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440627",
    "food_item": "Corn Pakoda",
    "serving_size": "1 plate (4 pieces, 100g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440628",
    "food_item": "Soya Chaap Tikka Masala",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 330
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440629",
    "food_item": "Wheat Puri",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 140
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440630",
    "food_item": "Paneer Kheema",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 340
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440631",
    "food_item": "Veg Bisi Bele Bath",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 250
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440632",
    "food_item": "Coconut Phirni",
    "serving_size": "1 cup (150g)",
    "calories_per_serve": 260
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440633",
    "food_item": "Mutton Pasanda",
    "serving_size": "1 cup (200g)",
    "calories_per_serve": 370
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440634",
    "food_item": "Ajwain Puri",
    "serving_size": "1 piece (50g)",
    "calories_per_serve": 160
  }
];

export default foodDatabase;
	
	
	
	
	
	
	
	
	
	
	





















//   const foodDatabase = [
//    {
// "food_item": "Butter Chicken",
// "serving_size": "1 cup (240g)",
// "calories_per_serve": 490
// },
// {
// "food_item": "Paneer Tikka",
// "serving_size": "100g (3-4 pieces)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Dal Makhani",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Aloo Paratha",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 290
// },
// {
// "food_item": "Samosa",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 260
// },
// {
// "food_item": "Biryani (Chicken)",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 310
// },
// {
// "food_item": "Idli",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 70
// },
// {
// "food_item": "Dosa (Plain)",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 160
// },
// {
// "food_item": "Chole Bhature",
// "serving_size": "1 plate (1 bhature + 1 cup chole)",
// "calories_per_serve": 500
// },
// {
// "food_item": "Pav Bhaji",
// "serving_size": "1 plate (2 pav + 1 cup bhaji)",
// "calories_per_serve": 400
// },
// {
// "food_item": "Raita",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 100
// },
// {
// "food_item": "Gulab Jamun",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Pulao (Vegetable)",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Tandoori Roti",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 120
// },
// {
// "food_item": "Palak Paneer",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 320
// },
// {
// "food_item": "Butter Chicken",
// "serving_size": "1 cup (240g)",
// "calories_per_serve": 490
// },
// {
// "food_item": "Paneer Tikka",
// "serving_size": "100g (3-4 pieces)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Dal Makhani",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Aloo Paratha",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 290
// },
// {
// "food_item": "Samosa (Vegetable)",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 260
// },
// {
// "food_item": "Chicken Biryani",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 310
// },
// {
// "food_item": "Idli",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 70
// },
// {
// "food_item": "Plain Dosa",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 160
// },
// {
// "food_item": "Chole Bhature",
// "serving_size": "1 plate (1 bhature + 1 cup chole)",
// "calories_per_serve": 500
// },
// {
// "food_item": "Pav Bhaji",
// "serving_size": "1 plate (2 pav + 1 cup bhaji)",
// "calories_per_serve": 400
// },
// {
// "food_item": "Raita (Cucumber)",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 100
// },
// {
// "food_item": "Gulab Jamun",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Vegetable Pulao",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Tandoori Roti",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 120
// },
// {
// "food_item": "Palak Paneer",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 320
// },
// {
// "food_item": "Rogan Josh (Mutton)",
// "serving_size": "1 cup (240g)",
// "calories_per_serve": 450
// },
// {
// "food_item": "Vada Pav",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Masala Dosa",
// "serving_size": "1 piece (150g)",
// "calories_per_serve": 240
// },
// {
// "food_item": "Rajma Masala",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Pani Puri",
// "serving_size": "6 pieces (120g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Jalebi",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Tandoori Chicken",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 220
// },
// {
// "food_item": "Sambar",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 140
// },
// {
// "food_item": "Rasam",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 80
// },
// {
// "food_item": "Kheer",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 280
// },
// {
// "food_item": "Naan (Butter)",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Pongal",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 220
// },
// {
// "food_item": "Fish Curry (Bengali)",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Aloo Gobi",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 190
// },
// {
// "food_item": "Misal Pav",
// "serving_size": "1 plate (1 cup misal + 2 pav)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Rasgulla",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 120
// },
// {
// "food_item": "Upma",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Prawn Masala",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 280
// },
// {
// "food_item": "Bhindi Masala",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 160
// },
// {
// "food_item": "Kachori",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Dhokla",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 80
// },
// {
// "food_item": "Malai Kofta",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 400
// },
// {
// "food_item": "Pesarattu",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Litti Chokha",
// "serving_size": "1 plate (2 litti + 1 cup chokha)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Mysore Pak",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Baingan Bharta",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Mutton Biryani",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 330
// },
// {
// "food_item": "Puri",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Shrikhand",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Kadhi Pakora",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 220
// },
// {
// "food_item": "Veg Kolhapuri",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Appam",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 120
// },
// {
// "food_item": "Chicken 65",
// "serving_size": "100g (4-5 pieces)",
// "calories_per_serve": 290
// },
// {
// "food_item": "Medu Vada",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 100
// },
// {
// "food_item": "Barfi (Milk)",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Pork Vindaloo",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Sev Puri",
// "serving_size": "6 pieces (120g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Methi Thepla",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 140
// },
// {
// "food_item": "Mutton Korma",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 400
// },
// {
// "food_item": "Uttapam",
// "serving_size": "1 piece (150g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Laddu (Besan)",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Chana Masala",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 220
// },
// {
// "food_item": "Veg Jalfrezi",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Prawn Biryani",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Parotta",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Rabri",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Aloo Tikki",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 120
// },
// {
// "food_item": "Chicken Chettinad",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Poha",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Sandesh",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Keema Matar",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Bhel Puri",
// "serving_size": "1 cup (100g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Kozhukattai",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 100
// },
// {
// "food_item": "Dahi Vada",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Mushroom Masala",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Kulfi",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Amritsari Fish",
// "serving_size": "100g (2-3 pieces)",
// "calories_per_serve": 280
// },
// {
// "food_item": "Chakli",
// "serving_size": "1 piece (20g)",
// "calories_per_serve": 100
// },
// {
// "food_item": "Goan Fish Curry",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Khichdi",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Pesarattu",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Modak",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Veg Korma",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Prawn Malai Curry",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 320
// },
// {
// "food_item": "Poori Masala",
// "serving_size": "1 plate (2 poori + 1 cup masala)",
// "calories_per_serve": 400
// },
// {
// "food_item": "Halwa (Sooji)",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Chicken Tikka Masala",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 400
// },
// {
// "food_item": "Pesarattu",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 180
// },
// {
// "food_item": "Luchi",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Matar Paneer",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Papdi Chaat",
// "serving_size": "1 plate (100g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Thalipeeth",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 200
// },
// {
// "food_item": "Mutton Do Pyaza",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 380
// },
// {
// "food_item": "Rava Idli",
// "serving_size": "1 piece (50g)",
// "calories_per_serve": 90
// },
// {
// "food_item": "Prawn Balchao",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 300
// },
// {
// "food_item": "Chivda",
// "serving_size": "1 cup (50g)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Egg Curry",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Puran Poli",
// "serving_size": "1 piece (100g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Doi Maach",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 280
// },
// {
// "food_item": "Khandvi",
// "serving_size": "100g (4-5 pieces)",
// "calories_per_serve": 150
// },
// {
// "food_item": "Shahi Paneer",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 350
// },
// {
// "food_item": "Bisi Bele Bath",
// "serving_size": "1 cup (200g)",
// "calories_per_serve": 250
// },
// {
// "food_item": "Phirni",
// "serving_size": "1 cup (150g)",
// "calories_per_serve": 250
// },
//   {
//     "food_item": "Kadai Chicken",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Gobi Manchurian",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Dal Tadka",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Methi Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Samosa (Keema)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Vegetable Biryani",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Rava Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Onion Uthappam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Pindi Chole",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Dahi Puri",
//     "serving_size": "6 pieces (120g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Kaju Katli",
//     "serving_size": "1 piece (25g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Tandoori Fish",
//     "serving_size": "100g (2-3 pieces)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Coconut Chutney",
//     "serving_size": "2 tbsp (30g)",
//     "calories_per_serve": 60
//   },
//   {
//     "food_item": "Tomato Rasam",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 70
//   },
//   {
//     "food_item": "Carrot Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Garlic Naan",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 310
//   },
//   {
//     "food_item": "Ven Pongal",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Macher Jhol",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Aloo Matar",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Ragda Patties",
//     "serving_size": "1 plate (2 patties + 1 cup ragda)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Peda",
//     "serving_size": "1 piece (30g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Sabudana Khichdi",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Fish Fry (Kerala Style)",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Paneer Butter Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Pav Bhaji (No Butter)",
//     "serving_size": "1 plate (2 pav + 1 cup bhaji)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Masala Vada",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Hyderabadi Biryani (Mutton)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Poori",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Mango Lassi",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Aloo Bhindi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 170
//   },
//   {
//     "food_item": "Thepla",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Chicken Korma",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 390
//   },
//   {
//     "food_item": "Set Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Motichoor Laddu",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Dal Fry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Bonda",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Dum Aloo",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Chicken Saag",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 330
//   },
//   {
//     "food_item": "Pesarattu with Upma",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Anarsa",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Lauki Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Kolkata Egg Roll",
//     "serving_size": "1 roll (150g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Rava Kesari",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Paneer Bhurji",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Masala Chai",
//     "serving_size": "1 cup (150ml)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Mutton Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Rava Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Chhena Poda",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Prawn Korma",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Aloo Chaat",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Puliogare",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Paneer Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Balushahi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Egg Bhurji",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Veg Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Adai",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Prawn Fry",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Besan Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Kadala Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Seviyan Kheer",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Chicken Vindaloo",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Akki Roti",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Dabeli",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Sooji Dhokla",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 90
//   },
//   {
//     "food_item": "Mutton Rogan Josh",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 400
//   },
//   {
//     "food_item": "Lemon Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Malpua",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Palak Dal",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Chicken Lollipop",
//     "serving_size": "2 pieces (100g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Patra",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Fish Amritsari",
//     "serving_size": "100g (2-3 pieces)",
//     "calories_per_serve": 290
//   },
//   {
//     "food_item": "Veg Kurma",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Ghevar",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Sabudana Vada",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Mutton Keema",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Curd Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Prawn Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Khaman",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Chicken Patiala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Masala Poori",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Badam Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 400
//   },
//   {
//     "food_item": "Aloo Posto",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Paneer Pasanda",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Kothu Parotta",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Boondi Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Avial",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Chicken Manchurian",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Pesarattu",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Prawn Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Rava Laddu",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Veg Manchurian",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Bhakarwadi",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Mutton Biryani (Lucknowi)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Pongal (Sweet)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Dahi Bhalla",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Paneer Makhani",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Coconut Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Jhal Muri",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Chicken Do Pyaza",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Ragi Roti",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Laal Maas",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Veg Hakka Noodles",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Moong Dal Chilla",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Gobi Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Samosa (Chicken)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 290
//   },
//   {
//     "food_item": "Jeera Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Neer Dosa",
//     "serving_size": "1 piece (80g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Tomato Uthappam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Amritsari Chole",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Ragda Puri",
//     "serving_size": "6 pieces (120g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Rasmalai",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Tandoori Prawn",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Mint Chutney",
//     "serving_size": "2 tbsp (30g)",
//     "calories_per_serve": 40
//   },
//   {
//     "food_item": "Pepper Rasam",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Beetroot Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Keema Naan",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Khara Pongal",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Shorshe Ilish",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Aloo Palak",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Kanda Bhaji",
//     "serving_size": "1 plate (4 pieces, 100g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Mawa Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Sabudana Tikki",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Chicken Fry (Andhra Style)",
//     "serving_size": "100g (2-3 pieces)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Paneer Kadai",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Vada (Urad Dal)",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 110
//   },
//   {
//     "food_item": "Hyderabadi Chicken Biryani",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 330
//   },
//   {
//     "food_item": "Missi Roti",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Buttermilk (Chaas)",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Baingan Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Undhiyu",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Chicken Seekh Kebab",
//     "serving_size": "2 pieces (100g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Oats Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Coconut Burfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Dal Baati",
//     "serving_size": "1 plate (2 baati + 1 cup dal)",
//     "calories_per_serve": 400
//   },
//   {
//     "food_item": "Prawn Tikka",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Kachumber Salad",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 50
//   },
//   {
//     "food_item": "Mutton Kheema Pav",
//     "serving_size": "1 plate (1 cup kheema + 2 pav)",
//     "calories_per_serve": 450
//   },
//   {
//     "food_item": "Rava Pongal",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Mysore Masala Dosa",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Badam Milk",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Chana Chaat",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Fish Tikka",
//     "serving_size": "100g (2-3 pieces)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Methi Malai Matar",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Masala Papad",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Chicken Kolhapuri",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Pesarattu with Chutney",
//     "serving_size": "1 piece (100g + 2 tbsp chutney)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Gajar Ka Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Veg Kheema",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Prawn Bhuna",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Masala Omelette",
//     "serving_size": "2 eggs (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Tamarind Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Paneer Kulcha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Soan Papdi",
//     "serving_size": "1 piece (30g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Egg Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Mushroom Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Davanagere Benne Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Prawn Vindaloo",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Atta Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Kerala Chicken Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Veg Fried Rice",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Murukku",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Mutton Saag",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Jowar Roti",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Sev Tamatar",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Paneer Do Pyaza",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Benne Seedai",
//     "serving_size": "1 cup (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Chicken Xacuti",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Pesarattu",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Mysore Bonda",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Pavakka Fry",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Chum Chum",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Matar Mushroom",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Fish Moilee",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Kothimbir Vadi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Paneer Jalfrezi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Sambar Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Pista Kulfi",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Chicken Malai Tikka",
//     "serving_size": "100g (3-4 pieces)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Poha Chivda",
//     "serving_size": "1 cup (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Mutton Vindaloo",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Bajra Roti",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Veg Kofta Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Mango Burfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Prawn Chettinad",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Corn Chaat",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Chicken Pepper Fry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Ragi Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Puran Poli (Maharashtrian)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Aloo Methi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Sooji Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Fish Kalia",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Pav (Bun)",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Paneer Tikka Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Bisibele Bath",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Gulab Phirni",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Mutton Sukka",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Methi Puri",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 160
//   },
//  {
//     "food_item": "Pork Sorpotel",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Veg Chowmein",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Besan Chilla",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Mooli Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Samosa (Paneer)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Saffron Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Ragi Idli",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Mixed Vegetable Uthappam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Punjabi Chole",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Sev Puri",
//     "serving_size": "6 pieces (120g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Imarti",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Tandoori Mutton Chops",
//     "serving_size": "100g (2 pieces)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Tamarind Chutney",
//     "serving_size": "2 tbsp (30g)",
//     "calories_per_serve": 50
//   },
//   {
//     "food_item": "Garlic Rasam",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 70
//   },
//   {
//     "food_item": "Pumpkin Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Cheese Naan",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 330
//   },
//   {
//     "food_item": "Sambar Vada",
//     "serving_size": "1 piece (100g + 1 cup sambar)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Chingri Malai Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Cabbage Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Pav Bhaji (Street Style)",
//     "serving_size": "1 plate (2 pav + 1 cup bhaji)",
//     "calories_per_serve": 420
//   },
//   {
//     "food_item": "Milk Peda",
//     "serving_size": "1 piece (30g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Sabudana Kheer",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Fish Fry (Andhra Style)",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Paneer Lababdar",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Idli Sambar",
//     "serving_size": "1 plate (2 idlis + 1 cup sambar)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Kashmiri Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Kulcha",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Rose Lassi",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Tindora Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Pithla",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Mutton Seekh Kebab",
//     "serving_size": "2 pieces (100g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Vermicelli Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Coconut Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Chole Kulche",
//     "serving_size": "1 plate (1 kulcha + 1 cup chole)",
//     "calories_per_serve": 400
//   },
//   {
//     "food_item": "Prawn Tandoori",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Sprouts Salad",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 60
//   },
//   {
//     "food_item": "Keema Pav",
//     "serving_size": "1 plate (1 cup keema + 2 pav)",
//     "calories_per_serve": 450
//   },
//   {
//     "food_item": "Rava Idli Sambar",
//     "serving_size": "1 plate (2 idlis + 1 cup sambar)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Cheese Dosa",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Saffron Lassi",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Corn Chaat",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Fish Pakora",
//     "serving_size": "100g (2-3 pieces)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Palak Kofta",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Roasted Papad",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 60
//   },
//   {
//     "food_item": "Chicken Handi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Adai with Chutney",
//     "serving_size": "1 piece (100g + 2 tbsp chutney)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Moong Dal Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Soya Chaap Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Prawn Sukka",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Masala Egg Bhurji",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Curd Rice with Pickle",
//     "serving_size": "1 cup (200g + 1 tbsp pickle)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Onion Kulcha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Petha",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Egg Vindaloo",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Peas Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Oats Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Prawn Pepper Fry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Til Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Kerala Mutton Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Chicken Fried Rice",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Thattai",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 90
//   },
//   {
//     "food_item": "Paneer Saag",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Makki Ki Roti",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Lauki Kofta",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Kesar Peda",
//     "serving_size": "1 piece (30g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Crab Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Moong Dal Vada",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Chicken Sukka",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Ragi Mudde",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Veg Cutlet",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//   {
//     "food_item": "Kalakand",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Matar Kulcha",
//     "serving_size": "1 plate (1 kulcha + 1 cup matar)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Fish Curry (Malabar Style)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Poha Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Paneer Achari",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Veg Pongal",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Mango Kulfi",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Chicken Afghani",
//     "serving_size": "100g (2-3 pieces)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Sev Murmura",
//     "serving_size": "1 cup (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Mutton Bhuna",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 370
//   },
//   {
//     "food_item": "Bajra Khichdi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Soya Chaap Tikka",
//     "serving_size": "100g (3-4 pieces)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Anjeer Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Prawn Balchao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 310
//   },
//   {
//     "food_item": "Sprouts Chaat",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Chicken Bharta",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Ragi Uttapam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Obbattu",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Gobi Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Pista Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Fish Paturi",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Aloo Kulcha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Kesar Phirni",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Mutton Pepper Fry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Palak Puri",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Chicken Rogan Josh",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Veg Schezwan Noodles",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Oats Chilla",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Onion Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Samosa (Potato and Peas)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Coconut Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Oats Idli",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Cheese Uthappam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Rajma Chawal",
//     "serving_size": "1 plate (1 cup rajma + 1 cup rice)",
//     "calories_per_serve": 400
//   },
//   {
//     "food_item": "Bhel Puri (Dry)",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Cham Cham",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Tandoori Pomfret",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Green Chutney",
//     "serving_size": "2 tbsp (30g)",
//     "calories_per_serve": 40
//   },
//   {
//     "food_item": "Lemon Rasam",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 70
//   },
//   {
//     "food_item": "Coconut Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Stuffed Naan",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Idli Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Rui Macher Kalia",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Mix Veg Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Batata Vada",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Pista Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Sabudana Thalipeeth",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Fish Fry (Goan Style)",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Paneer Malai Kofta",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Dosa with Sambar",
//     "serving_size": "1 piece (100g + 1 cup sambar)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Tehri",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Amritsari Kulcha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 310
//   },
//   {
//     "food_item": "Kesar Lassi",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Arbi Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 170
//   },
//   {
//     "food_item": "Zunka",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Paneer Seekh Kebab",
//     "serving_size": "2 pieces (100g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Broken Wheat Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Nariyal Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Dal Baati Churma",
//     "serving_size": "1 plate (2 baati + 1 cup dal + 50g churma)",
//     "calories_per_serve": 450
//   },
//   {
//     "food_item": "Prawn Pakora",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Cucumber Salad",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 40
//   },
//   {
//     "food_item": "Misal Pav (Spicy)",
//     "serving_size": "1 plate (1 cup misal + 2 pav)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Rava Dosa with Chutney",
//     "serving_size": "1 piece (100g + 2 tbsp chutney)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Paper Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Mango Shrikhand",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Sprouts Poha",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Prawn Pakoda",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Matar Paneer Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Urad Dal Papad",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 60
//   },
//   {
//     "food_item": "Chicken Achari",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Neer Dosa with Chutney",
//     "serving_size": "1 piece (80g + 2 tbsp chutney)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Rava Kesari Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Soya Chaap Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Crab Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 310
//   },
//   {
//     "food_item": "Masala Dosa with Potato Filling",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Sesame Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Aloo Stuffed Kulcha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 310
//   },
//   {
//     "food_item": "Mathri",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Egg Korma",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Paneer Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Wheat Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Prawn Koliwada",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Coconut Ladoo (No Sugar)",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Kerala Fish Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Prawn Fried Rice",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Namak Para",
//     "serving_size": "1 cup (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Mushroom Kadai",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Jowar Bhakri",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Gobi Manchurian Dry",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Saffron Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Squid Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Sabudana Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Chicken Pasanda",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Ragi Porridge",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Aloo Poha",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Kaju Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Pav Bhaji (Jain)",
//     "serving_size": "1 plate (2 pav + 1 cup bhaji)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Pomfret Fry",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Methi Matar Malai",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Veg Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 170
//   },
//   {
//     "food_item": "Mango Phirni",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Mutton Achari",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 370
//   },
//   {
//     "food_item": "Beetroot Puri",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Paneer Bharta",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Bisi Bele Bath (Jain)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Sev Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Chicken Kheema Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Methi Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Pesarattu with Upma",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Mushroom Bhaji",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Fish Curry (Mangalorean)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Puran Poli (Gujarati)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Badam Kheer",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Chicken Tikka",
//     "serving_size": "100g (3-4 pieces)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Corn Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Masala Vada",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 120
//   },
//  {
//     "food_item": "Butter Paneer",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Manchurian Fried Rice",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Rava Chilla",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Palak Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Samosa (Mutton)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Mint Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Barley Idli",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Paneer Uthappam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Kadhi Chawal",
//     "serving_size": "1 plate (1 cup kadhi + 1 cup rice)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Sukhi Bhel",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Malai Peda",
//     "serving_size": "1 piece (30g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Tandoori Surmai",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Peanut Chutney",
//     "serving_size": "2 tbsp (30g)",
//     "calories_per_serve": 80
//   },
//   {
//     "food_item": "Mysore Rasam",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 70
//   },
//   {
//     "food_item": "Lauki Halwa",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Peshawari Naan",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Masala Pongal",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Bengali Fish Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Chana Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Onion Pakoda",
//     "serving_size": "1 plate (4 pieces, 100g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Besan Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Sabudana Pakoda",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Fish Fry (Tamil Nadu Style)",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Paneer Handi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Idli Fry",
//     "serving_size": "1 plate (2 idlis, 100g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Veg Yakhni Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Laccha Paratha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Sweet Lassi",
//     "serving_size": "1 glass (200ml)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Parwal Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Bhakri",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Fish Seekh Kebab",
//     "serving_size": "2 pieces (100g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Quinoa Upma",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Mawa Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Gatte Ki Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Prawn Hariyali",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Onion Salad",
//     "serving_size": "1 cup (100g)",
//     "calories_per_serve": 40
//   },
//   {
//     "food_item": "Vada Pav (Street Style)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Rava Idli with Chutney",
//     "serving_size": "1 plate (2 idlis + 2 tbsp chutney)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Onion Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Pista Shrikhand",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Moong Dal Poha",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Chicken Pakoda",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Soya Chaap Kadai",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Masala Papad (Fried)",
//     "serving_size": "1 piece (20g)",
//     "calories_per_serve": 100
//   },
//   {
//     "food_item": "Mutton Handi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Set Dosa with Chutney",
//     "serving_size": "1 piece (100g + 2 tbsp chutney)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Pineapple Kesari",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Veg Malai Kofta",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Squid Fry",
//     "serving_size": "100g (4-5 pieces)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Masala Egg Omelette",
//     "serving_size": "2 eggs (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Garlic Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Cheese Kulcha",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 320
//   },
//   {
//     "food_item": "Doodh Peda",
//     "serving_size": "1 piece (30g)",
//     "calories_per_serve": 130
//   },
//   {
//     "food_item": "Egg Do Pyaza",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Matar Pulao",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Jowar Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Prawn Achari",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 290
//   },
//   {
//     "food_item": "Rava Ladoo",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Andhra Chicken Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Egg Fried Rice",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 230
//   },
//   {
//     "food_item": "Shakkar Para",
//     "serving_size": "1 cup (50g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Soya Chaap Butter Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Bajra Bhakri",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Mushroom Manchurian",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Almond Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Clam Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Barley Dosa",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 160
//   },
//   {
//     "food_item": "Mutton Kheema Curry",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 360
//   },
//   {
//     "food_item": "Oats Porridge",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Veg Poha",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 180
//   },
//   {
//     "food_item": "Til Barfi",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Jain Pav Bhaji",
//     "serving_size": "1 plate (2 pav + 1 cup bhaji)",
//     "calories_per_serve": 380
//   },
//   {
//     "food_item": "Sardine Fry",
//     "serving_size": "100g (1 piece)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Kaddu Ki Sabzi",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 150
//   },
//   {
//     "food_item": "Rava Uttapam",
//     "serving_size": "1 piece (150g)",
//     "calories_per_serve": 200
//   },
//   {
//     "food_item": "Kesar Kheer",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 280
//   },
//   {
//     "food_item": "Chicken Bhuna Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 350
//   },
//   {
//     "food_item": "Tomato Rice",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 210
//   },
//   {
//     "food_item": "Methi Pesarattu",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Palak Mushroom",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 190
//   },
//   {
//     "food_item": "Fish Curry (Kerala Style)",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 270
//   },
//   {
//     "food_item": "Puran Poli (Karnataka Style)",
//     "serving_size": "1 piece (100g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Pista Kheer",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 300
//   },
//   {
//     "food_item": "Chicken Hariyali Tikka",
//     "serving_size": "100g (3-4 pieces)",
//     "calories_per_serve": 240
//   },
//   {
//     "food_item": "Mushroom Fried Rice",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 220
//   },
//   {
//     "food_item": "Corn Pakoda",
//     "serving_size": "1 plate (4 pieces, 100g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Soya Chaap Tikka Masala",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 330
//   },
//   {
//     "food_item": "Wheat Puri",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 140
//   },
//   {
//     "food_item": "Paneer Kheema",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 340
//   },
//   {
//     "food_item": "Veg Bisi Bele Bath",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 250
//   },
//   {
//     "food_item": "Coconut Phirni",
//     "serving_size": "1 cup (150g)",
//     "calories_per_serve": 260
//   },
//   {
//     "food_item": "Mutton Pasanda",
//     "serving_size": "1 cup (200g)",
//     "calories_per_serve": 370
//   },
//   {
//     "food_item": "Ajwain Puri",
//     "serving_size": "1 piece (50g)",
//     "calories_per_serve": 160
//   }
//  ];

// export default foodDatabase;