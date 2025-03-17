import React, { useEffect } from 'react';
import { useAppSelector } from '../app/hooks';

const EmailVerifying = () => {
  const user = useAppSelector((state) => state.user.user);
  useEffect(() => {
    
  })
  return (
    <div>Please EmailVerifying</div>
  )
}

export default EmailVerifying;