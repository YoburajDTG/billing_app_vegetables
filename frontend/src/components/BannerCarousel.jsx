import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import ownerBanner from '../assets/owner_banner.png';
import './BannerCarousel.css';

const banners = [
    {
        id: 0,
        image: ownerBanner,
        title: "Welcome to Suji Vegetables",
        subtitle: "Owned & Operated by Suji Family - Serving you since 2026."
    },
    {
        id: 1,
        image: banner1,
        title: "Fresh from Farm",
        subtitle: "Get the best quality vegetables directly from local farmers."
    },
    {
        id: 2,
        image: banner2,
        title: "Organic & Healthy",
        subtitle: "100% Organic certified vegetables for your healthy lifestyle."
    },
    {
        id: 3,
        image: banner3,
        title: "Fast Delivery",
        subtitle: "We deliver freshness to your doorstep within minutes."
    }
];

const BannerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="banner-carousel">
            <div
                className="banner-slides"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} className="banner-slide">
                        <img src={banner.image} alt={banner.title} />
                        <div className="banner-content">
                            <h2>{banner.title}</h2>
                            <p>{banner.subtitle}</p>
                        </div>
                        <div className="banner-overlay"></div>
                    </div>
                ))}
            </div>

            <button className="banner-btn prev" onClick={prevSlide}>
                <ChevronLeft size={24} />
            </button>
            <button className="banner-btn next" onClick={nextSlide}>
                <ChevronRight size={24} />
            </button>

            <div className="banner-dots">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
