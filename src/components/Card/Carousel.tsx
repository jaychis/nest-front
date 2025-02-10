import { useState } from "react";
import styled, { keyframes } from "styled-components";

interface CarouselProps {
    imageList: string[];
}

const Carousel = ({ imageList }: CarouselProps) => {
    const [carouselIndex, setCarouselIndex] = useState<number>(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const back = "https://i.ibb.co/tPxhdPpB/download-7.webp"
    const next = "https://i.ibb.co/N2Msc8Sk/download-8.webp"

    const handelNext = () => {
        setDirection('next');
        setCarouselIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    };

    const handleBack = () => {
        setDirection('prev');
        setCarouselIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (diffX > 50) {
            handelNext();
        } else if (diffX < -50) {
            handleBack();
        }

        setTouchStartX(null);
    };

    return (
        <CarouselContainer>
            <ArrowIcon src={back} onClick={handleBack} />
            <CarouselImageWrapper
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <CarouselImage
                    src={imageList[carouselIndex]}
                    direction={direction}
                    key={carouselIndex}
                    loading="lazy"
                />
            </CarouselImageWrapper>
            <ArrowIcon src={next} onClick={handelNext} />
        </CarouselContainer>
    );
};

const slideInNext = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0.5;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideInPrev = keyframes`
    from {
        transform: translateX(-100%);
        opacity: 0.5;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const CarouselContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 450px;
    height: 350px;
    overflow: hidden;
    position: relative;
`;

const CarouselImageWrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CarouselImage = styled.img<{ direction: 'next' | 'prev' }>`
    width: 400px;
    height: auto;
    object-fit: cover;
    animation: ${({ direction }) => (direction === 'next' ? slideInNext : slideInPrev)} 0.5s ease-in-out;
`;

const ArrowIcon = styled.img`
    width: 50px;
    height: 50px;
    cursor: pointer;
    user-select: none;
`;

export default Carousel;