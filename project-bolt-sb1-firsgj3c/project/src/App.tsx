import React from 'react';
import { MapPin, Navigation, Clock, DollarSign, Car, Phone, Star, Plane, Bus, Camera, Home, Map, History, User } from 'lucide-react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const SERVICES = [
  {
    title: '包車旅遊',
    icon: <Bus className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&q=80&w=2070',
    description: '量身打造專屬行程，資深司機導遊帶您探索台灣之美'
  },
  {
    title: '機場接送',
    icon: <Plane className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2074',
    description: '舒適便捷的機場接送服務，準時可靠的專業團隊'
  },
  {
    title: '景點推薦',
    icon: <Camera className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1470004914212-05527e49370b?auto=format&fit=crop&q=80&w=2070',
    description: '精選台灣特色景點，打造難忘旅遊體驗'
  }
];

const VEHICLES = [
  {
    model: 'Toyota Camry',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=2070',
    capacity: '4人座',
    price: '基本價格 NT$1,000'
  },
  {
    model: 'Tesla Model Y',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259b6e09?auto=format&fit=crop&q=80&w=2070',
    capacity: '5人座',
    price: '基本價格 NT$1,200'
  },
  {
    model: 'Mercedes Vito',
    image: 'https://images.unsplash.com/photo-1618093831580-945921adb682?auto=format&fit=crop&q=80&w=2070',
    capacity: '8人座',
    price: '基本價格 NT$1,500'
  }
];

const AIRPORT_PRICES = {
  taoyuan: [
    { destination: '台北市', price: 1200 },
    { destination: '新北市', price: 1300 },
    { destination: '基隆市', price: 1500 }
  ],
  songshan: [
    { destination: '台北市', price: 800 },
    { destination: '新北市', price: 900 },
    { destination: '基隆市', price: 1100 }
  ]
};

interface Location {
  address: string;
  coordinates?: { lat: number; lng: number };
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  carModel: string;
  licensePlate: string;
  phone: string;
  eta: number;
}

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const BASE_FARE = 50; // Base fare in currency units
const PER_KM_RATE = 15; // Rate per kilometer

function App() {
  const [pickup, setPickup] = React.useState<Location>({ address: '' });
  const [destination, setDestination] = React.useState<Location>({ address: '' });
  const [budget, setBudget] = React.useState<number>(0);
  const [estimatedFare, setEstimatedFare] = React.useState<number>(0);
  const [matchedDriver, setMatchedDriver] = React.useState<Driver | null>(null);
  const [pickupAutocomplete, setPickupAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);
  const [destAutocomplete, setDestAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const calculateFare = async () => {
    if (!pickup.coordinates || !destination.coordinates) return;

    const service = new google.maps.DistanceMatrixService();
    const result = await service.getDistanceMatrix({
      origins: [{ lat: pickup.coordinates.lat, lng: pickup.coordinates.lng }],
      destinations: [{ lat: destination.coordinates.lat, lng: destination.coordinates.lng }],
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (result.rows[0]?.elements[0]?.distance) {
      const distanceInKm = result.rows[0].elements[0].distance.value / 1000;
      const fare = BASE_FARE + (distanceInKm * PER_KM_RATE);
      setEstimatedFare(Math.round(fare));
    }
  };

  const handlePlaceSelect = (autocomplete: google.maps.places.Autocomplete, isPickup: boolean) => {
    const place = autocomplete.getPlace();
    if (place.geometry?.location) {
      const location = {
        address: place.formatted_address || '',
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      };
      if (isPickup) {
        setPickup(location);
      } else {
        setDestination(location);
      }
      calculateFare();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to LINE
    window.location.href = 'https://line.me/R/ti/p/@your-line-id';
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-full p-2">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">Kenw 專業車隊</h1>
              <p className="mt-1 text-gray-600 text-sm font-medium">服務至上・顧客優先・賓至如歸的乘車體驗</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 text-gray-800">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            關於 Kenw
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Kenw 致力於提供最優質的乘車服務，我們擁有經驗豐富的專業車隊，
            提供安全舒適的乘車體驗。無論是商務接送、觀光旅遊還是機場接送，
            我們都能為您量身打造最適合的行程方案。
          </p>
          <div className="mt-6 grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              <p className="font-semibold text-blue-600 text-lg">專業車隊</p>
              <p className="text-sm text-gray-600 mt-1">嚴選優質司機</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              <p className="font-semibold text-blue-600 text-lg">全天候服務</p>
              <p className="text-sm text-gray-600 mt-1">24小時待命</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
              <p className="font-semibold text-blue-600 text-lg">安心保障</p>
              <p className="text-sm text-gray-600 mt-1">乘客保險</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            我們的服務
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <div key={index} className="service-card">
                <img src={service.image} alt={service.title} />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    {service.icon}
                    <h3 className="text-xl font-semibold ml-2">{service.title}</h3>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vehicles Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            車型介紹
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VEHICLES.map((vehicle, index) => (
              <div key={index} className="service-card">
                <img src={vehicle.image} alt={vehicle.model} />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{vehicle.model}</h3>
                  <p className="text-gray-600">{vehicle.capacity}</p>
                  <p className="text-gray-600">{vehicle.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Airport Transfer Prices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            機場接送價目表
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">桃園國際機場</h3>
              <table className="price-table">
                <thead>
                  <tr>
                    <th>目的地</th>
                    <th>價格 (NT$)</th>
                  </tr>
                </thead>
                <tbody>
                  {AIRPORT_PRICES.taoyuan.map((item, index) => (
                    <tr key={index}>
                      <td>{item.destination}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">松山機場</h3>
              <table className="price-table">
                <thead>
                  <tr>
                    <th>目的地</th>
                    <th>價格 (NT$)</th>
                  </tr>
                </thead>
                <tbody>
                  {AIRPORT_PRICES.songshan.map((item, index) => (
                    <tr key={index}>
                      <td>{item.destination}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">上車地點</label>
                  <Autocomplete
                    onLoad={setPickupAutocomplete}
                    onPlaceChanged={() => pickupAutocomplete && handlePlaceSelect(pickupAutocomplete, true)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="請輸入上車地點"
                    />
                  </Autocomplete>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Navigation className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">目的地點</label>
                  <Autocomplete
                    onLoad={setDestAutocomplete}
                    onPlaceChanged={() => destAutocomplete && handlePlaceSelect(destAutocomplete, false)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="請輸入目的地點"
                    />
                  </Autocomplete>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <DollarSign className="w-6 h-6 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">預算金額</label>
                  <input
                    type="number"
                    value={budget || ''}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="請輸入預算金額"
                    min="0"
                  />
                </div>
              </div>
              
              {estimatedFare > 0 && (
                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">預估車資：NT$ {estimatedFare}</p>
                    {budget < estimatedFare && (
                      <p className="text-sm text-red-500 mt-1">
                        提醒：您的預算金額低於預估車資
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {matchedDriver && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">已為您配對專屬司機</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">{matchedDriver.carModel} ({matchedDriver.licensePlate})</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-gray-700">{matchedDriver.rating} 分</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-700">{matchedDriver.phone}</span>
                    </div>
                    <div className="mt-2 text-sm text-blue-700">
                      預計 {matchedDriver.eta} 分鐘後抵達上車地點
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!matchedDriver ? (
              <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" alt="LINE" className="w-6 h-6 mr-2" />
                透過 LINE 預約
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => window.location.href = `tel:${matchedDriver.phone}`}
                >
                  聯絡司機
                </button>
                <button
                  type="button"
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setMatchedDriver(null)}
                >
                  取消預約
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex justify-between py-3">
            <button className="flex flex-col items-center text-blue-600">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">首頁</span>
            </button>
            <button className="flex flex-col items-center text-gray-600">
              <Map className="w-6 h-6" />
              <span className="text-xs mt-1">熱門景點</span>
            </button>
            <button className="flex flex-col items-center text-gray-600">
              <History className="w-6 h-6" />
              <span className="text-xs mt-1">我的行程</span>
            </button>
            <button className="flex flex-col items-center text-gray-600">
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">個人資料</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;