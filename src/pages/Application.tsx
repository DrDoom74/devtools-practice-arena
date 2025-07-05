import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Application = () => {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("ru");
  const [username, setUsername] = useState("");
  const [storageData, setStorageData] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedTheme = localStorage.getItem("devtools-theme") || "dark";
    const savedLanguage = localStorage.getItem("devtools-language") || "ru";
    const savedUsername = localStorage.getItem("devtools-username") || "";
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setUsername(savedUsername);
    
    // Применяем тему к body
    document.body.setAttribute("data-theme", savedTheme);
    
    loadStorageData();
  }, []);

  const loadStorageData = () => {
    const data: {[key: string]: string} = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("devtools-")) {
        data[key] = localStorage.getItem(key) || "";
      }
    }
    setStorageData(data);
  };

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("devtools-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
    loadStorageData();
    
    toast({
      title: "Тема изменена",
      description: `Установлена ${newTheme === "dark" ? "тёмная" : "светлая"} тема`,
    });
  };

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("devtools-language", newLanguage);
    loadStorageData();
    
    toast({
      title: "Язык изменён",
      description: `Язык интерфейса: ${newLanguage === "ru" ? "Русский" : "English"}`,
    });
  };

  const saveUsername = () => {
    localStorage.setItem("devtools-username", username);
    loadStorageData();
    
    toast({
      title: "Имя пользователя сохранено",
      description: `Добро пожаловать, ${username}!`,
    });
  };

  const clearStorage = () => {
    const keys = Object.keys(storageData);
    keys.forEach(key => localStorage.removeItem(key));
    
    setTheme("dark");
    setLanguage("ru");
    setUsername("");
    document.body.setAttribute("data-theme", "dark");
    loadStorageData();
    
    toast({
      title: "Хранилище очищено",
      description: "Все данные localStorage удалены",
    });
  };

  const addSessionData = () => {
    const timestamp = new Date().toISOString();
    sessionStorage.setItem("devtools-session", timestamp);
    sessionStorage.setItem("devtools-page-visits", "1");
    
    toast({
      title: "SessionStorage обновлен",
      description: "Данные сессии добавлены",
    });
  };

  const addCookieData = () => {
    document.cookie = "devtools-demo=test-value; path=/; max-age=3600";
    document.cookie = "user-preference=advanced; path=/; max-age=3600";
    
    toast({
      title: "Cookies установлены",
      description: "Проверьте Application → Cookies в DevTools",
    });
  };

  const simulateIndexedDB = async () => {
    try {
      const request = indexedDB.open("DevToolsDemo", 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const objectStore = db.createObjectStore("settings", { keyPath: "id" });
        objectStore.add({ id: 1, name: "theme", value: theme });
        objectStore.add({ id: 2, name: "language", value: language });
      };
      
      request.onsuccess = () => {
        toast({
          title: "IndexedDB создана",
          description: "База данных создана и заполнена тестовыми данными",
        });
      };
      
      request.onerror = () => {
        toast({
          title: "Ошибка IndexedDB",
          description: "Не удалось создать базу данных",
          variant: "destructive"
        });
      };
    } catch (error) {
      console.error("IndexedDB error:", error);
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-all duration-500 ${
      theme === "light" ? "brightness-125" : ""
    }`}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            📦 Application - Хранилище данных
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Работайте с localStorage, sessionStorage, cookies, IndexedDB и изучайте хранилище браузера
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-gradient-card border-devtools-blue/20">
          <CardHeader>
            <CardTitle className="text-devtools-blue">📋 Изучение хранилища в DevTools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-green">🗄️ Типы хранилища:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>localStorage:</strong> Постоянное хранилище</li>
                  <li>• <strong>sessionStorage:</strong> Данные сессии</li>
                  <li>• <strong>Cookies:</strong> HTTP куки</li>
                  <li>• <strong>IndexedDB:</strong> Браузерная база данных</li>
                  <li>• <strong>Cache Storage:</strong> Кеш Service Worker</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-orange">🔧 Полезные действия:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Clear Storage - полная очистка</li>
                  <li>• Редактирование значений двойным кликом</li>
                  <li>• Добавление новых ключей через контекстное меню</li>
                  <li>• Фильтрация по ключам или значениям</li>
                  <li>• Экспорт/импорт данных хранилища</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Control */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-purple">⚙️ Настройки приложения</CardTitle>
              <CardDescription>Изменения сохраняются в localStorage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Тема интерфейса:</label>
                <Select value={theme} onValueChange={updateTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">🌙 Тёмная</SelectItem>
                    <SelectItem value="light">☀️ Светлая</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Язык интерфейса:</label>
                <Select value={language} onValueChange={updateLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя пользователя:</label>
                <div className="flex space-x-2">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введите имя..."
                  />
                  <Button onClick={saveUsername}>
                    Сохранить
                  </Button>
                </div>
              </div>

              {/* Current User Display */}
              {username && (
                <div className="p-3 rounded-lg bg-gradient-accent/20 border border-accent/30">
                  <p className="text-sm">
                    <strong>👋 Привет, {username}!</strong><br/>
                    <span className="text-muted-foreground">
                      Тема: {theme === "dark" ? "Тёмная" : "Светлая"} | 
                      Язык: {language === "ru" ? "Русский" : "English"}
                    </span>
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                <p className="text-sm">
                  <strong>💡 Совет:</strong> Откройте DevTools → Application → Local Storage, 
                  чтобы увидеть сохранённые настройки.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Storage Inspector */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-green">🔍 Инспектор хранилища</CardTitle>
              <CardDescription>Текущие данные в localStorage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Storage Data Display */}
              <div className="space-y-3">
                <h5 className="font-semibold">Данные localStorage:</h5>
                {Object.keys(storageData).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Хранилище пусто</p>
                    <p className="text-sm">Измените настройки для добавления данных</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(storageData).map(([key, value]) => (
                      <div key={key} className="p-2 rounded bg-muted/30 border border-border">
                        <div className="font-mono text-sm">
                          <div className="text-devtools-blue">{key}</div>
                          <div className="text-muted-foreground truncate">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Storage Actions */}
              <div className="space-y-3">
                <h5 className="font-semibold">Действия с хранилищем:</h5>
                
                <Button onClick={addSessionData} variant="outline" className="w-full">
                  Добавить sessionStorage
                </Button>
                
                <Button onClick={addCookieData} variant="outline" className="w-full">
                  Установить Cookies
                </Button>
                
                <Button onClick={simulateIndexedDB} variant="outline" className="w-full">
                  Создать IndexedDB
                </Button>
                
                <Button 
                  onClick={clearStorage} 
                  variant="outline"
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10"
                >
                  Очистить всё хранилище
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Types Info */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-orange">💾 Типы хранилища браузера</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-blue">localStorage</h4>
                <p className="text-sm text-muted-foreground">
                  Постоянное хранилище, ~5-10MB, не отправляется на сервер
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-green">sessionStorage</h4>
                <p className="text-sm text-muted-foreground">
                  Хранилище сессии, очищается при закрытии вкладки
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-purple">Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Небольшие данные (~4KB), отправляются с каждым запросом
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-orange">IndexedDB</h4>
                <p className="text-sm text-muted-foreground">
                  NoSQL база данных браузера, до сотен МБ данных
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Application;