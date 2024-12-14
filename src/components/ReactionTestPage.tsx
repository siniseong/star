'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ReactionTest from './ReactionTest';
import Logo from './Logo';
import Footer from './Footer';

export default function ReactionTestPage() {
  const [showTest, setShowTest] = useState<boolean>(false);
  const reactionTestRef = useRef<{ startTest: () => void } | null>(null);

  const handleStart = () => {
    if (showTest && reactionTestRef.current) {
      reactionTestRef.current.startTest();
    } else {
      setShowTest(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4" style={{ marginTop: '100px' }}>
        <Card className="w-[350px] mx-auto">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Logo className="w-12 h-12 flex-shrink-0" />
            <div>
              <CardTitle className="text-2xl">반응 속도 테스트</CardTitle>
              <CardDescription>
                당신의 반응 속도를 측정해보세요!
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={handleStart}>시작</Button>
          </CardFooter>
        </Card>
        {showTest && (
          <ReactionTest
            ref={reactionTestRef}
            globalBestTime={null}
            globalBestName={null}
          />
        )}
      </main>
      <Footer />
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: '반응 속도 테스트',
          description:
            '온라인에서 간편하게 반응 속도를 측정하고 다른 사람들과 비교해보세요.',
          url: '',
          applicationCategory: 'GameApplication',
          operatingSystem: 'Any',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KRW',
          },
        })}
      </script>
    </div>
  );
}
