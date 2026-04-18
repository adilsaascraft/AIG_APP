'use client';
//This file is a client component in Next.js, which allows us to use hooks like useState and useEffect. 
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  const calculateTimeLeft = () => {
    const target = new Date("2025-08-01T00:00:00");
    const now = new Date();
    const difference = +target - +now;
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md w-full">
        <motion.h1
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Divina is currently working hard on this page!
        </motion.h1>

        <motion.p
          className="text-gray-500 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Website currently under maintenance
        </motion.p>

        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/comming-soon.png"
            alt="Maintenance"
            width={300}
            height={300}
            className="w-full max-w-xs"
            priority
          />
        </motion.div>

        {isClient && (
          <div className="flex justify-center gap-4 text-lg font-semibold text-gray-800 mb-6">
            <div className="text-center">
              <div className="text-3xl">{timeLeft.days}</div>
              <div className="text-sm text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">{timeLeft.hours}</div>
              <div className="text-sm text-gray-500">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">{timeLeft.minutes}</div>
              <div className="text-sm text-gray-500">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl">{timeLeft.seconds}</div>
              <div className="text-sm text-gray-500">Seconds</div>
            </div>
          </div>
        )}

        <Link
          href="https://saascraft.studio/"
          className="inline-block bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
         Owned by SaaScraft Studio (India) Pvt. Ltd.
        </Link>
      </div>
    </main>
  );
}