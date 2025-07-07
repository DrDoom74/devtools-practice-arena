import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Timer, Play, Square, RotateCcw, Clock } from "lucide-react";

const Console = () => {
  // Timer and Async Testing State
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTimers, setActiveTimers] = useState<Set<NodeJS.Timeout>>(new Set());
  const [activeIntervals, setActiveIntervals] = useState<Set<NodeJS.Timeout>>(new Set());
  const [promiseStates, setPromiseStates] = useState<{[key: string]: 'pending' | 'resolved' | 'rejected'}>({});
  const [timerProgress, setTimerProgress] = useState<{[key: string]: number}>({});
  const [customDelay, setCustomDelay] = useState<number>(2);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [intervalCount, setIntervalCount] = useState<number>(0);
  const [isIntervalActive, setIsIntervalActive] = useState<boolean>(false);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '📝';
    setLogs(prev => [...prev, `[${timestamp}] ${emoji} ${message}`]);
    
    // Also log to browser console
    console.log(`Timer Test: ${message}`);
  };

  const clearLogs = () => {
    setLogs([]);
    console.clear();
  };

  const clearAllTimers = () => {
    // Clear all active timers
    activeTimers.forEach(timer => clearTimeout(timer));
    activeIntervals.forEach(interval => clearInterval(interval));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setActiveTimers(new Set());
    setActiveIntervals(new Set());
    setPromiseStates({});
    setTimerProgress({});
    setIsIntervalActive(false);
    setIntervalCount(0);
    
    addLog("Все таймеры и интервалы очищены", 'warning');
  };

  // setTimeout Testing
  const testSetTimeout = (delay: number) => {
    const startTime = Date.now();
    const timerKey = `timeout-${Date.now()}`;
    
    addLog(`Запущен setTimeout на ${delay} сек`);
    console.time(`setTimeout-${delay}s`);
    
    // Progress tracking
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / (delay * 1000)) * 100, 100);
      setTimerProgress(prev => ({ ...prev, [timerKey]: progress }));
    }, 100);

    const timer = setTimeout(() => {
      console.timeEnd(`setTimeout-${delay}s`);
      addLog(`setTimeout завершен через ${delay} сек`, 'success');
      clearInterval(progressInterval);
      setTimerProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[timerKey];
        return newProgress;
      });
      setActiveTimers(prev => {
        const newSet = new Set(prev);
        newSet.delete(timer);
        return newSet;
      });
    }, delay * 1000);

    setActiveTimers(prev => new Set(prev).add(timer));
  };

  // setInterval Testing
  const startInterval = () => {
    if (isIntervalActive) return;
    
    setIsIntervalActive(true);
    setIntervalCount(0);
    addLog("Запущен setInterval (каждую секунду)");
    
    const interval = setInterval(() => {
      setIntervalCount(prev => {
        const newCount = prev + 1;
        console.log(`Интервал тик #${newCount}`);
        addLog(`Интервал тик #${newCount}`, 'info');
        return newCount;
      });
    }, 1000);
    
    intervalRef.current = interval;
    setActiveIntervals(prev => new Set(prev).add(interval));
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsIntervalActive(false);
      addLog(`Интервал остановлен. Всего тиков: ${intervalCount}`, 'warning');
      setActiveIntervals(prev => {
        const newSet = new Set(prev);
        if (intervalRef.current) newSet.delete(intervalRef.current);
        return newSet;
      });
    }
  };

  // Promise Testing
  const testPromiseSuccess = () => {
    const promiseKey = 'promise-success';
    setPromiseStates(prev => ({ ...prev, [promiseKey]: 'pending' }));
    addLog("Запущен Promise (успех через 3 сек)");
    
    console.time('Promise-Success');
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Успешный результат!');
      }, 3000);
    });

    promise.then((result) => {
      console.timeEnd('Promise-Success');
      addLog(`Promise resolved: ${result}`, 'success');
      setPromiseStates(prev => ({ ...prev, [promiseKey]: 'resolved' }));
    });
  };

  const testPromiseError = () => {
    const promiseKey = 'promise-error';
    setPromiseStates(prev => ({ ...prev, [promiseKey]: 'pending' }));
    addLog("Запущен Promise (ошибка через 2 сек)");
    
    console.time('Promise-Error');
    const promise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Тестовая ошибка Promise'));
      }, 2000);
    });

    promise.catch((error) => {
      console.timeEnd('Promise-Error');
      addLog(`Promise rejected: ${error.message}`, 'error');
      setPromiseStates(prev => ({ ...prev, [promiseKey]: 'rejected' }));
    });
  };

  const testPromiseAll = () => {
    const promiseKey = 'promise-all';
    setPromiseStates(prev => ({ ...prev, [promiseKey]: 'pending' }));
    addLog("Запущен Promise.all (3 промиса)");
    
    console.time('Promise-All');
    const promises = [
      new Promise(resolve => setTimeout(() => resolve('Результат 1'), 1000)),
      new Promise(resolve => setTimeout(() => resolve('Результат 2'), 2000)),
      new Promise(resolve => setTimeout(() => resolve('Результат 3'), 1500))
    ];

    Promise.all(promises).then((results) => {
      console.timeEnd('Promise-All');
      addLog(`Promise.all completed: [${results.join(', ')}]`, 'success');
      setPromiseStates(prev => ({ ...prev, [promiseKey]: 'resolved' }));
    });
  };

  // Async/Await Testing
  const testAsyncAwait = async () => {
    addLog("Запущена async функция");
    console.time('Async-Await');
    
    try {
      const result = await new Promise((resolve) => {
        setTimeout(() => resolve('Async результат'), 2500);
      });
      
      console.timeEnd('Async-Await');
      addLog(`Async/await completed: ${result}`, 'success');
    } catch (error) {
      addLog(`Async/await error: ${error.message}`, 'error');
    }
  };

  // Race Condition Test
  const testRaceCondition = () => {
    addLog("Тест гонки условий: 3 операции одновременно");
    
    // Быстрая операция
    setTimeout(() => {
      addLog("🥇 Быстрая операция (1 сек) - ФИНИШ!", 'success');
    }, 1000);
    
    // Средняя операция
    setTimeout(() => {
      addLog("🥈 Средняя операция (2 сек) - финиш", 'success');
    }, 2000);
    
    // Медленная операция
    setTimeout(() => {
      addLog("🥉 Медленная операция (3 сек) - финиш", 'success');
    }, 3000);
  };

  const generateError = () => {
    try {
      throw new Error("Демонстрационная ошибка для DevTools Console");
    } catch (error) {
      console.error("🚨 Ошибка для тестирования:", error);
      addLog("🚨 Ошибка отправлена в DevTools Console", 'error');
    }
  };

  const selectElement = (selector: string) => {
    try {
      const element = document.querySelector(selector);
      if (element) {
        console.log("Selected element:", element);
        addLog(`Элемент выбран: ${selector}`, 'success');
        addLog("Проверьте DevTools Console", 'info');
      }
    } catch (error) {
      addLog(`Ошибка выбора: ${error.message}`, 'error');
    }
  };

  const monitorElement = () => {
    const element = document.querySelector('#console-demo-element');
    if (element) {
      ['click', 'mouseover', 'mouseout'].forEach(eventType => {
        element.addEventListener(eventType, (e) => {
          console.log(`Event monitored: ${eventType} on`, e.target);
        });
      });
      addLog("События мониторятся. Проверьте DevTools Console", 'info');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            ⏱️ Console - Тестирование таймеров и асинхронного кода
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Изучайте поведение setTimeout, setInterval, Promise и async/await кода с помощью практических тестов
          </p>
        </div>

        {/* Instructions */}
        <Card className="mb-8 bg-gradient-card border-devtools-blue/20">
          <CardHeader>
            <CardTitle className="text-devtools-blue">📋 Тестирование асинхронных операций</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-green">setTimeout(callback, delay)</div>
                  <div className="text-muted-foreground">Выполнение через указанное время</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-green">setInterval(callback, delay)</div>
                  <div className="text-muted-foreground">Повторное выполнение через интервалы</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-green">Promise.resolve/reject</div>
                  <div className="text-muted-foreground">Асинхронные промисы</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-orange">async/await</div>
                  <div className="text-muted-foreground">Современный асинхронный синтаксис</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-orange">Promise.all()</div>
                  <div className="text-muted-foreground">Параллельное выполнение промисов</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                  <div className="text-devtools-orange">console.time/timeEnd</div>
                  <div className="text-muted-foreground">Измерение времени выполнения</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timer and Async Testing */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-purple flex items-center gap-2">
                <Timer className="w-5 h-5" />
                ⏱️ Тестирование таймеров и асинхронного кода
              </CardTitle>
              <CardDescription>Практические тесты для изучения асинхронных операций</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* setTimeout Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-green flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  setTimeout Tests
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => testSetTimeout(2)} variant="outline" size="sm">
                    Таймер 2 сек
                  </Button>
                  <Button onClick={() => testSetTimeout(5)} variant="outline" size="sm">
                    Таймер 5 сек
                  </Button>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={customDelay}
                      onChange={(e) => setCustomDelay(Number(e.target.value))}
                      className="w-20"
                      min="1"
                      max="10"
                    />
                    <Button onClick={() => testSetTimeout(customDelay)} variant="outline" size="sm">
                      Кастомный
                    </Button>
                  </div>
                </div>
                
                {/* Progress indicators */}
                {Object.entries(timerProgress).map(([key, progress]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-xs text-muted-foreground">Прогресс таймера</div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </div>

              {/* setInterval Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-blue flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  setInterval Tests
                </h4>
                <div className="flex gap-2 items-center">
                  <Button 
                    onClick={startInterval} 
                    variant="outline" 
                    size="sm"
                    disabled={isIntervalActive}
                  >
                    Старт интервала
                  </Button>
                  <Button 
                    onClick={stopInterval} 
                    variant="outline" 
                    size="sm"
                    disabled={!isIntervalActive}
                  >
                    Стоп интервала
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Тиков: {intervalCount} | Статус: {isIntervalActive ? '🟢 Активен' : '🔴 Остановлен'}
                  </div>
                </div>
              </div>

              {/* Promise Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-orange">Promise Tests</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={testPromiseSuccess} variant="outline" size="sm">
                    Promise успех
                  </Button>
                  <Button onClick={testPromiseError} variant="outline" size="sm">
                    Promise ошибка
                  </Button>
                  <Button onClick={testPromiseAll} variant="outline" size="sm">
                    Promise.all
                  </Button>
                </div>
                
                {/* Promise states */}
                <div className="space-y-1">
                  {Object.entries(promiseStates).map(([key, state]) => (
                    <div key={key} className="text-sm flex items-center gap-2">
                      <span className="font-mono">{key}:</span>
                      <span className={
                        state === 'pending' ? 'text-yellow-500' :
                        state === 'resolved' ? 'text-green-500' :
                        'text-red-500'
                      }>
                        {state === 'pending' ? '🟡 Pending' : 
                         state === 'resolved' ? '✅ Resolved' : '❌ Rejected'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Async/Await and Advanced Tests */}
              <div className="space-y-3">
                <h4 className="font-semibold text-devtools-purple">Продвинутые тесты</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={testAsyncAwait} variant="outline" size="sm">
                    Async/Await
                  </Button>
                  <Button onClick={testRaceCondition} variant="outline" size="sm">
                    Гонка условий
                  </Button>
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={clearAllTimers} variant="destructive" size="sm">
                  <Square className="w-4 h-4 mr-1" />
                  Очистить все таймеры
                </Button>
                <Button onClick={clearLogs} variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Очистить логи
                </Button>
                <div className="text-xs text-muted-foreground flex items-center">
                  Активных операций: {activeTimers.size + activeIntervals.size}
                </div>
              </div>

              {/* Logs */}
              <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] font-mono text-sm">
                <div className="text-devtools-green mb-2">Логи тестирования:</div>
                {logs.length === 0 ? (
                  <div className="text-muted-foreground">Логи операций появятся здесь...</div>
                ) : (
                  <div className="space-y-1 max-h-[150px] overflow-y-auto">
                    {logs.slice(-10).map((line, index) => (
                      <div key={index} className={
                        line.includes('✅') ? 'text-green-400' :
                        line.includes('❌') ? 'text-red-400' :
                        line.includes('⚠️') ? 'text-yellow-400' :
                        'text-foreground'
                      }>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="text-devtools-green">🎯 Элементы для тестирования</CardTitle>
              <CardDescription>Используйте эти элементы в своих Console командах</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Demo Element */}
              <div 
                id="console-demo-element"
                className="console-card p-4 rounded-lg bg-gradient-accent/20 border border-accent/30 cursor-pointer transition-smooth hover:shadow-glow"
                onClick={() => console.log('Demo element clicked!')}
              >
                <h4 className="font-semibold text-accent">Демонстрационный элемент</h4>
                <p className="text-sm text-muted-foreground">
                  ID: console-demo-element<br/>
                  Class: console-card
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h5 className="font-semibold">Быстрые действия:</h5>
                
                <Button 
                  onClick={() => selectElement('#console-demo-element')}
                  variant="outline" 
                  className="w-full"
                >
                  Выбрать элемент по ID
                </Button>
                
                <Button 
                  onClick={generateError}
                  variant="outline" 
                  className="w-full text-devtools-red border-devtools-red/30 hover:bg-devtools-red/10"
                >
                  Сгенерировать ошибку
                </Button>
                
                <Button 
                  onClick={monitorElement}
                  variant="outline" 
                  className="w-full"
                >
                  Мониторить события
                </Button>

                <Button 
                  onClick={() => {
                    console.table([
                      { name: 'Elements', shortcut: 'Ctrl+Shift+C' },
                      { name: 'Console', shortcut: 'Ctrl+Shift+J' },
                      { name: 'Network', shortcut: 'Ctrl+Shift+E' }
                    ]);
                    addLog("Таблица отправлена в DevTools Console", 'info');
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  Показать таблицу
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Отображает таблицу с горячими клавишами DevTools в консоли браузера (F12)
                </p>
              </div>

              {/* Quick Commands */}
              <div className="space-y-2">
                <h5 className="font-semibold text-devtools-blue">💡 Попробуйте эти команды:</h5>
                <div className="text-xs space-y-1 font-mono bg-muted/50 p-3 rounded-lg">
                  <div>$0.style.border = '2px solid red'</div>
                  <div>$0.textContent = 'Изменено!'</div>
                  <div>console.log($0)</div>
                  <div>monitorEvents($0, 'click')</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="text-devtools-orange">💡 Советы по работе с Console</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-blue">Автодополнение</h4>
                <p className="text-sm text-muted-foreground">
                  Используйте Tab для автодополнения методов и свойств объектов
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-green">Фильтрация</h4>
                <p className="text-sm text-muted-foreground">
                  Фильтруйте логи по типу (Errors, Warnings, Info) в панели Console
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-devtools-purple">Многострочный код</h4>
                <p className="text-sm text-muted-foreground">
                  Shift+Enter для перехода на новую строку без выполнения кода
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Console;