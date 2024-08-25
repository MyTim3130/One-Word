'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/app/home');
  }, []);

  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

export default Page;
