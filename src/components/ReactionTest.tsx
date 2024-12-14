'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Logo from './Logo';

const ageRanges = {
  '🏂 10대': { min: 0, max: 250 },
  '🧑‍💻 20대': { min: 250, max: 300 },
  '🦸 30대': { min: 300, max: 350 },
  '🧑‍🎄 40대': { min: 350, max: 400 },
  '👩‍🔧 50대': { min: 400, max: 450 },
  '👴 60대 이상': { min: 450, max: Infinity },
};

type TestState = 'waiting' | 'ready' | 'go' | 'early' | 'done';

const getRandomColor = () => {
  const colors = [
    '#3b82f6', 
    '#ef4444', 
    '#eab308', 
    '#8b5cf6', 
    '#ec4899', 
    '#f97316',
    '#2563eb', 
    '#6b7280', 
    '#d1fae5',
    '#fbbf24', 
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

type ReactionTestRef = {
  startTest: () => void;
};

type ReactionTestProps = {
  globalBestTime?: number | null;
  globalBestName?: string | null;
};

const ReactionTest = forwardRef<ReactionTestRef, ReactionTestProps>(
  (props, ref) => {
    const [state, setState] = useState<TestState>('waiting');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [currentColor, setCurrentColor] = useState<string>('#3b82f6');
    const [isClickable, setIsClickable] = useState<boolean>(true);
    const colorChangeInterval = useRef<NodeJS.Timeout | null>(null);
    const goTimeout = useRef<NodeJS.Timeout | null>(null);

    const clearAllTimers = () => {
      if (colorChangeInterval.current) {
        clearInterval(colorChangeInterval.current);
        colorChangeInterval.current = null;
      }
      if (goTimeout.current) {
        clearTimeout(goTimeout.current);
        goTimeout.current = null;
      }
    };

    const startTest = useCallback(() => {
      if (!isClickable) return;
      clearAllTimers();
      setState('ready');
      setShowResult(false);
      setReactionTime(null);
      setIsClickable(true);
      colorChangeInterval.current = setInterval(() => {
        setCurrentColor(getRandomColor());
      }, 200);
      goTimeout.current = setTimeout(() => {
        if (colorChangeInterval.current) {
          clearInterval(colorChangeInterval.current);
        }
        setState('go');
        setCurrentColor('#22c55e');
        setStartTime(Date.now());
      }, Math.random() * 3000 + 1000);
    }, [isClickable]);

    useImperativeHandle(ref, () => ({
      startTest,
    }));

    const handleClick = () => {
      if (!isClickable) return;

      if (state === 'waiting' || state === 'done' || state === 'early') {
        startTest();
      } else if (state === 'ready') {
        clearAllTimers();
        setState('early');
        setShowResult(true);
        setIsClickable(false);
        setTimeout(() => setIsClickable(true), 1000);
      } else if (state === 'go') {
        setEndTime(Date.now());
        setState('done');
        setIsClickable(false);
        setTimeout(() => setIsClickable(true), 1000);
      }
    };

    useEffect(() => {
      if (state === 'done' && startTime && endTime) {
        const time = endTime - startTime;
        setReactionTime(time);
        setShowResult(true);
      }
    }, [state, startTime, endTime]);

    useEffect(() => {
      return () => {
        clearAllTimers();
      };
    }, []);

    const getAgeRange = (time: number): string => {
      for (const [age, range] of Object.entries(ageRanges)) {
        if (time >= range.min && time < range.max) {
          return age;
        }
      }
      return '👴 60대 이상';
    };

    return (
      <Card className="w-full max-w-[350px] md:max-w-[450px] mx-auto mt-4">
        <CardHeader className="flex flex-row items-center space-x-4 flex-wrap sm:flex-nowrap">
          <Logo className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex-shrink-0" />
          <div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl">반응 속도 테스트</CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg">
              <span>
                <span className="text-green-500">초록색</span>으로 변하면
                클릭하세요!
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="w-full h-32 sm:h-40 md:h-48 flex items-center justify-center cursor-pointer mb-4 rounded-lg text-sm sm:text-base md:text-lg"
            animate={{ backgroundColor: currentColor }}
            onClick={handleClick}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center px-4"
            >
              {state === 'waiting' && '클릭하여 시작'}
              {state === 'ready' && '🫀두근두근,,'}
              {state === 'go' && '지금!!'}
              {state === 'early' && '초록색 되면 눌려라 했다.'}
              {state === 'done' && `${reactionTime}ms`}
            </motion.span>
          </motion.div>
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {state === 'early' ? (
                  <motion.p
                    className="mt-2 text-sm sm:text-base md:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    초록색! 초록색!! 초록색!!!
                  </motion.p>
                ) : (
                  reactionTime !== null && (
                    <>
                      <Progress
                        value={(reactionTime / 500) * 100}
                        className="w-full"
                      />
                      <motion.p
                        className="mt-2 text-sm sm:text-base md:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        당신의 반응 속도는{' '}
                        <span className="text-red-500 font-semibold">
                          {getAgeRange(reactionTime)}
                        </span>{' '}
                        수준입니다!
                      </motion.p>
                    </>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={startTest}
            disabled={!isClickable || state === 'ready' || state === 'go'}
            className="mx-auto text-sm sm:text-base md:text-lg md:px-8 md:py-6"
          >
            다시 시도
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ReactionTest.displayName = 'ReactionTest';

export default ReactionTest;