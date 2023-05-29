"use client"
import type { FC } from 'react';
import useActiveChannel from '../hooks/useActiveChannel';

interface ActiveStatusProps { }

const ActiveStatus: FC<ActiveStatusProps> = () => {
  useActiveChannel()
  return (<div>

  </div>);
}

export default ActiveStatus;
