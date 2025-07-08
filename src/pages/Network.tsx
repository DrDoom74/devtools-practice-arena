import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Network = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<any[]>([]);
  const [userAgent, setUserAgent] = useState<string>("");
  const { toast } = useToast();

  const makeApiRequest = async (url: string, method: string = 'GET') => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'DevToolsTrainer'
        }
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      const requestData = {
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        duration,
        timestamp: new Date().toLocaleTimeString(),
        headers: Object.fromEntries(response.headers.entries()),
        size: response.headers.get('content-length') || 'unknown',
        isHttpError: response.status >= 400
      };
      
      setRequestHistory(prev => [requestData, ...prev.slice(0, 9)]);
      
      const toastVariant = response.status >= 400 ? "destructive" : "default";
      const toastTitle = response.status >= 400 ? "HTTP ошибка" : "Запрос выполнен";
      
      toast({
        title: toastTitle,
        description: `${method} ${url} - ${response.status} (${duration}ms)`,
        variant: toastVariant
      });
      
    } catch (error) {
      const requestData = {
        url,
        method,
        status: 0,
        statusText: 'Network Error',
        duration: Date.now() - startTime,
        timestamp: new Date().toLocaleTimeString(),
        error: error.message,
        isNetworkError: true
      };
      
      setRequestHistory(prev => [requestData, ...prev.slice(0, 9)]);
      
      toast({
        title: "Сетевая ошибка",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateSlowRequest = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    // Симуляция медленного запроса
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const requestData = {
      url: '/api/slow-endpoint',
      method: 'GET',
      status: 200,
      statusText: 'OK',
      duration: Date.now() - startTime,
      timestamp: new Date().toLocaleTimeString(),
      simulated: true
    };
    
    setRequestHistory(prev => [requestData, ...prev.slice(0, 9)]);
    setIsLoading(false);
    
    toast({
      title: "Медленный запрос завершен",
      description: "Проверьте вкладку Network в DevTools",
    });
  };

  const makeFailedRequest = async () => {
    await makeApiRequest('https://jsonplaceholder.typicode.com/posts/999', 'GET');
  };

  const makeServerErrorRequest = async () => {
    await makeApiRequest('https://httpbin.org/status/500', 'GET');
  };

  const makeForbiddenRequest = async () => {
    await makeApiRequest('https://httpbin.org/status/403', 'GET');
  };

  const clearHistory = () => {
    setRequestHistory([]);
    toast({
      title: "История очищена",
      description: "История запросов была очищена",
    });
  };

  const testUserAgent = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await fetch('https://httpbin.org/user-agent', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'DevToolsTrainer'
        }
      });
      
      const data = await response.json();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setUserAgent(data['user-agent'] || 'Unknown');
      
      const requestData = {
        url: 'https://httpbin.org/user-agent',
        method: 'GET',
        status: response.status,
        statusText: response.statusText,
        duration,
        timestamp: new Date().toLocaleTimeString(),
        userAgentResponse: data['user-agent']
      };
      
      setRequestHistory(prev => [requestData, ...prev.slice(0, 9)]);
      
      toast({
        title: "User Agent получен",
        description: `Ваш User Agent: ${data['user-agent']?.substring(0, 50)}...`,
      });
      
    } catch (error) {
      toast({
        title: "Ошибка получения User Agent",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            🌐 Network - Анализ HTTP запросов
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Отслеживайте сетевые запросы, анализируйте производительность, изучайте заголовки и тестируйте API
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-gradient-card border-devtools-blue/20">
          <CardHeader>
            <CardTitle className="text-devtools-blue">📋 Как работать с Network вкладкой</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-green">🔍 Основные функции:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Откройте DevTools → Network перед выполнением запросов</li>
                  <li>• Фильтруйте запросы: XHR/Fetch, JS, CSS, Images</li>
                  <li>• Изучайте Headers, Response, Preview, Timing</li>
                  <li>• Используйте Throttling для симуляции медленного интернета</li>
                  <li>• Включите "Preserve log" для сохранения запросов</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-orange">⚡ Полезные действия:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  
                  <li>• ПКМ → Copy as cURL для использования в терминале</li>
                  <li>• ПКМ → Copy as fetch для JavaScript кода</li>
                  <li>• ПКМ → Block request URL для блокировки</li>
                  <li>• Disable cache для отключения кеширования</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Request Controls */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-purple">🚀 Генератор запросов</CardTitle>
              <CardDescription>Создавайте различные типы HTTP запросов для анализа</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Request Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => makeApiRequest('https://jsonplaceholder.typicode.com/posts/1')}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Загрузка..." : "GET запрос (JSON API)"}
                </Button>

                <Button 
                  onClick={() => makeApiRequest('https://httpbin.org/get')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  GET запрос (с headers)
                </Button>

                <Button 
                  onClick={makeFailedRequest}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10"
                >
                  Запрос с ошибкой (404)
                </Button>

                <Button 
                  onClick={simulateSlowRequest}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-devtools-orange border-devtools-orange/30 hover:bg-devtools-orange/10"
                >
                  Медленный запрос (3s)
                </Button>

                <Button 
                  onClick={makeServerErrorRequest}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10"
                >
                  Запрос с ошибкой (500)
                </Button>

                <Button 
                  onClick={makeForbiddenRequest}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10"
                >
                  Запрос с ошибкой (403)
                </Button>

                <Button 
                  onClick={() => makeApiRequest('https://httpbin.org/post', 'POST')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  POST запрос
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                <p className="text-sm">
                  <strong>💡 Совет:</strong> Откройте DevTools → Network перед нажатием кнопок, 
                  чтобы увидеть все детали запросов.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Request History */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-devtools-green">📊 История запросов</CardTitle>
                <CardDescription>Последние выполненные запросы</CardDescription>
              </div>
              <Button onClick={clearHistory} variant="outline" size="sm">
                Очистить
              </Button>
            </CardHeader>
            <CardContent>
              {requestHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>История запросов пуста</p>
                  <p className="text-sm">Выполните запрос для просмотра деталей</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {requestHistory.map((request, index) => (
                    <div key={index} className="p-3 rounded-lg border border-border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            request.method === 'GET' ? 'bg-devtools-blue/20 text-devtools-blue' :
                            request.method === 'POST' ? 'bg-devtools-green/20 text-devtools-green' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {request.method}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            request.status >= 200 && request.status < 300 ? 'bg-devtools-green/20 text-devtools-green' :
                            request.status >= 400 ? 'bg-devtools-red/20 text-devtools-red' :
                            'bg-devtools-orange/20 text-devtools-orange'
                          }`}>
                            {request.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {request.duration}ms
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {request.timestamp}
                        </span>
                      </div>
                      <div className="text-sm font-mono truncate text-muted-foreground">
                        {request.url}
                      </div>
                      {request.error && (
                        <div className="text-xs text-destructive mt-1">
                          Error: {request.error}
                        </div>
                      )}
                      {request.simulated && (
                        <div className="text-xs text-devtools-orange mt-1">
                          Симулированный запрос
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Agent Testing */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-purple">🔍 Тестирование User Agent</CardTitle>
            <CardDescription>Изучите как изменить и протестировать User Agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-blue">📖 Как изменить User Agent:</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>1. Откройте DevTools (F12)</li>
                  <li>2. Перейдите на вкладку Network</li>
                  <li>3. Нажмите на иконку More network conditions</li>
                  <li>4. Снимите галочку "Use browser default"</li>
                  <li>5. Выберите другой User Agent из списка</li>
                  <li>6. Или введите свой кастомный User Agent</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-green">🧪 Тестирование:</h4>
                <Button 
                  onClick={testUserAgent}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Получение..." : "Получить текущий User Agent"}
                </Button>
                {userAgent && (
                  <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                    <p className="text-sm font-medium mb-1">Ваш User Agent:</p>
                    <p className="text-xs font-mono text-muted-foreground break-all">
                      {userAgent}
                    </p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  💡 Измените User Agent в DevTools и нажмите кнопку снова для проверки
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-orange">🔧 Продвинутые возможности Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-blue">Block request URL</h4>
                <p className="text-sm text-muted-foreground">
                  Block request URL — блокируйте загрузку ресурсов по URL для проверки поведения при отсутствии API, скриптов, шрифтов и других внешних ресурсов.<br/>
                  ➤ Используется при тестировании отказоустойчивости фронтенда (например, как ведёт себя UI без ответа от сервера).
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-green">Timing Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Используйте вкладку Timing внутри каждого запроса на вкладке Network для анализа задержек (waiting, blocking, DNS lookup и др.).<br/>
                  ➤ А для полной картины производительности страницы используйте вкладку Performance.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-purple">Response Override</h4>
                <p className="text-sm text-muted-foreground">
                  Response Override (через Overrides) позволяет заменить ответ сервера локальным содержимым — например, имитировать ошибку API, отсутствие данных или специфический кейс.<br/>
                  ➤ Используется для ручного тестирования edge-сценариев и UI-обработки нестандартных ответов.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Network;