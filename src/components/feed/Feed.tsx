"use client";
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

// create a function that have 3 chance to return 1, 2 chance to return 2, 1 chance to return 3
function random() {
  const numbers = [1, 1, 1, 1, 1, 2, 2, 2];
  return numbers[Math.floor(Math.random() * numbers.length)];
}

// create an array of length passed in parameter and fill it with random number from the random
function randomFill(length: number) {
  let id = 0;
  return Array.from({ length }, () => ({ id: id++, w: random(), h: random() }));
}

const Loader = () => {
  const [points, setPoints] = React.useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        if (prev.length === 3) return '.';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className='flex items-center justify-center mx-auto mt-32'>
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-4'>
          <Skeleton className='w-20 h-40' />
          <Skeleton className='w-20 h-20' />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row gap-4'>
            <Skeleton className='w-40 h-20' />
            <Skeleton className='w-20 h-20' />
            <Skeleton className='w-20 h-20' />
          </div>
          <div className='flex items-center justify-center h-16'>
            <h2 className='text-2xl text-center font-semibold'>Chargement des setups{points}</h2>
          </div>
          <div className='flex flex-row gap-4'>
            <Skeleton className='w-20 h-20' />
            <Skeleton className='w-40 h-20' />
            <Skeleton className='w-20 h-20' />
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <Skeleton className='w-20 h-20' />
          <Skeleton className='w-20 h-40' />
        </div>
      </div>
    </div>
  )
}

const EndOfList = () => {
  return <h2 className='text-center text-3xl my-8 font-bold'>Fin des setups !</h2>
}

class Feed extends React.Component {
  state: any;

  constructor(props: any) {
    super(props);
    this.state = {
      grid: null,
      dataLength: 0,
    };
  }

  async componentDidMount() {
    const grid = GridStack.init({
        float: true,
        disableDrag: true,
        disableResize: true,
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    randomFill(100).forEach((item: any) => grid.addWidget({w: item.w, h: item.h, content: `<div class="grid-stack-item-content w-full h-full bg-cover bg-center rounded-lg bg-[url('https://placehold.co/600x400')]"></div>`}));
    this.setState({grid, dataLength: 100});
  }

  addMore = () => {
    randomFill(20).forEach((item: any) => this.state.grid.addWidget({w: item.w, h: item.h, content: `<div class="grid-stack-item-content w-full h-full bg-cover bg-center rounded-lg bg-[url('https://placehold.co/600x400')]"></div>`}));
    this.setState({dataLength: this.state.dataLength + 20});
  }

  render() {
    return (
      <InfiniteScroll
        dataLength={this.state.dataLength}
        next={this.addMore}
        hasMore={this.state.dataLength < 200}
        loader={<Loader />}
        endMessage={<EndOfList/>}
      >
        <div className="grid-stack overflow-hidden"></div>
      </InfiniteScroll>
    );
  }
}
export default Feed;