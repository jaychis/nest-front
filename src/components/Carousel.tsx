import { useState } from "react";
import styled, { keyframes } from "styled-components";
import back from '../assets/img/icons8-뒤로-50.png'
import next from '../assets/img/icons8-앞으로-50.png'

interface CarouselProps {
    imageList: string[]
}
const Carousel = ({imageList}:CarouselProps) => {

    const [carouselIndex, setCarouselIndex] = useState<number>(0)
    const [direction, setDirection] = useState<'next' | 'prev'>('next'); 

    const handelNext = () => {
        setDirection('next');
        if(carouselIndex  === imageList.length - 1) setCarouselIndex(0)
        else setCarouselIndex(carouselIndex+1)
    }

    const handleBack = () => {
        if(carouselIndex  === 0) setCarouselIndex(imageList.length - 1)
            else setCarouselIndex(carouselIndex-1)
    }

    return(
        <CarouselContainer>
            <ArrowIcon src = {back} onClick = {handleBack}/>
            <CarouselImage 
            src = {imageList[carouselIndex]} 
            key={carouselIndex}
            direction={direction}
            />
            <ArrowIcon src = {next} onClick = {handelNext} />
        </CarouselContainer>
    )
}

const slideInNext = keyframes`
    from{
        transform: translateX(100%);
    }

    to{
        transform: translateX(0);    
    }
`

const CarouselContainer = styled.div`
    display: flex;
    width: 100px:
    height: 100px;
    align-items: center;
    overflow: hiden;
`

const CarouselImage = styled.img<{ direction: 'next' | 'prev' }>`
    width: 250px;
    height: 250px;
    animation: ${({ direction }) => (direction === 'next' ? slideInNext : null)} 0.5s ease-in-out;

`

const ArrowIcon = styled.img`
    width: 50px;
    height: 50px;
`

export default Carousel