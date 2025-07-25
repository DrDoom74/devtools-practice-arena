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
  const [savedUsername, setSavedUsername] = useState(""); // Сохраненное имя для отображения
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [storageData, setStorageData] = useState<{[key: string]: string}>({});
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  // Валидация имени пользователя
  const validateUsername = (value: string): { isValid: boolean; error: string } => {
    if (!value.trim()) {
      return { isValid: true, error: "" }; // Пустое значение допустимо
    }

    // Проверка длины
    if (value.length > 50) {
      return { isValid: false, error: "Имя пользователя не может быть длиннее 50 символов" };
    }

    // Проверка на разрешенные символы (латиница, кириллица, цифры, пробелы, дефис, подчеркивание)
    const allowedPattern = /^[a-zA-Zа-яА-ЯёЁ0-9\s\-_]+$/;
    if (!allowedPattern.test(value)) {
      return { isValid: false, error: "Разрешены только буквы, цифры, пробелы, дефис и подчеркивание" };
    }

    // Проверка на потенциально опасные конструкции
    const dangerousPatterns = [
      /<[^>]*>/g, // HTML теги
      /javascript:/i,
      /onclick/i,
      /onload/i,
      /onerror/i,
      /script/i,
      /&[#\w]+;/g // HTML entities
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(value)) {
        return { isValid: false, error: "Обнаружены недопустимые символы или конструкции" };
      }
    }

    return { isValid: true, error: "" };
  };

  // Санитизация имени пользователя
  const sanitizeUsername = (value: string): string => {
    return value
      .replace(/<[^>]*>/g, '') // Удаляем HTML теги
      .replace(/&[#\w]+;/g, '') // Удаляем HTML entities
      .replace(/[<>&"']/g, '') // Удаляем опасные символы
      .trim(); // Убираем лишние пробелы
  };

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    const savedTheme = localStorage.getItem("devtools-theme") || "dark";
    const savedLanguage = localStorage.getItem("devtools-language") || "ru";
    const savedUsernameFromStorage = localStorage.getItem("devtools-username") || "";
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setUsername(savedUsernameFromStorage);
    setSavedUsername(savedUsernameFromStorage); // Устанавливаем сохраненное имя
    
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

  // Обработка изменения имени пользователя с валидацией
  const handleUsernameChange = (value: string) => {
    const sanitizedValue = sanitizeUsername(value);
    setUsername(sanitizedValue);
    
    const validation = validateUsername(sanitizedValue);
    setIsUsernameValid(validation.isValid);
    setUsernameError(validation.error);
    
    // Логируем попытки ввода опасного контента (для демонстрации)
    if (!validation.isValid) {
      console.warn("Попытка ввода недопустимого содержимого:", { original: value, sanitized: sanitizedValue, error: validation.error });
    }
  };

  const saveUsername = () => {
    if (!isUsernameValid) {
      toast({
        title: "Ошибка валидации",
        description: "Исправьте ошибки в имени пользователя перед сохранением",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem("devtools-username", username);
    setSavedUsername(username); // Обновляем сохраненное имя для отображения
    loadStorageData();
    
    toast({
      title: "Имя пользователя сохранено",
      description: `Добро пожаловать, ${username}!`,
    });
  };

  const clearStorage = async () => {
    setIsClearing(true);
    const clearedTypes: string[] = [];
    
    try {
      // Очистка localStorage
      const keys = Object.keys(storageData);
      keys.forEach(key => localStorage.removeItem(key));
      if (keys.length > 0) clearedTypes.push("localStorage");
      
      // Очистка sessionStorage
      if (sessionStorage.length > 0) {
        sessionStorage.clear();
        clearedTypes.push("sessionStorage");
      }
      
      // Очистка cookies
      const cookies = document.cookie.split(";");
      let cookiesCleared = false;
      cookies.forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          cookiesCleared = true;
        }
      });
      if (cookiesCleared) clearedTypes.push("cookies");
      
      // Очистка IndexedDB
      try {
        const deleteDB = indexedDB.deleteDatabase("DevToolsDemo");
        deleteDB.onsuccess = () => {
          console.log("IndexedDB удалена успешно");
        };
        deleteDB.onerror = () => {
          console.log("IndexedDB не найдена или уже удалена");
        };
        clearedTypes.push("IndexedDB");
      } catch (error) {
        console.log("Ошибка при удалении IndexedDB:", error);
      }
      
      // Сброс состояния
      setTheme("dark");
      setLanguage("ru");
      setUsername("");
      setSavedUsername("");
      document.body.setAttribute("data-theme", "dark");
      loadStorageData();
      
      toast({
        title: "Всё хранилище очищено",
        description: `Очищено: ${clearedTypes.join(", ")}`,
      });
    } catch (error) {
      console.error("Ошибка при очистке хранилища:", error);
      toast({
        title: "Ошибка очистки",
        description: "Не удалось полностью очистить хранилище",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
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
                  <li>• <strong>Cache Storage:</strong> кеш ресурсов, управляемый Service Worker.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-orange">🔧 Полезные действия:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Clear Storage - полная очистка</li>
                  <li>• Редактирование значений двойным кликом</li>
                  <li>• Добавление новых ключей через контекстное меню</li>
                  <li>• Фильтрация по ключам или значениям</li>
                  
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
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="Введите имя..."
                      className={!isUsernameValid ? "border-destructive focus-visible:ring-destructive" : ""}
                      maxLength={50}
                    />
                    <Button 
                      onClick={saveUsername}
                      disabled={!isUsernameValid || !username.trim()}
                    >
                      Сохранить
                    </Button>
                  </div>
                  
                  {/* Подсказка с правилами */}
                  <p className="text-xs text-muted-foreground">
                    Разрешены буквы, цифры, пробелы, дефис и подчеркивание (макс. 50 символов)
                  </p>
                  
                  {/* Сообщение об ошибке */}
                  {usernameError && (
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ {usernameError}
                    </p>
                  )}
                  
                  {/* Индикатор валидного ввода */}
                  {username.trim() && isUsernameValid && (
                    <p className="text-sm text-green-600 font-medium">
                      ✅ Имя пользователя корректно
                    </p>
                  )}
                </div>
              </div>

              {/* Current User Display */}
              {savedUsername && (
                <div className="p-3 rounded-lg bg-gradient-accent/20 border border-accent/30">
                  <p className="text-sm">
                    <strong>👋 Привет, {savedUsername}!</strong><br/>
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
                  disabled={isClearing}
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10 disabled:opacity-50"
                >
                  {isClearing ? "Очищается..." : "Очистить всё хранилище"}
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

        {/* Footer */}
        <div className="text-center border-t border-border pt-8 mt-16">
          <p className="text-muted-foreground text-sm">
            Школа Алексея Клименко по тестированию ПО | {" "}
            <a 
              href="https://t.me/QA_AKlimenko" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              Телеграм канал
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Application;