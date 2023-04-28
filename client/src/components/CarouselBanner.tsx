import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const CarouselBanner = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  //   const customTransition = {
  //     transform: "translate3d(-20px, 0, 0)",
  //   };

  const slides = [
    {
      id: 1,
      title: "Achetez des propriétés à des prix abordables",
      link: "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      title: "Vendez vos propriétés en quelques clics",
      link: "https://images.pexels.com/photos/7534555/pexels-photo-7534555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      button: "Commencer maintenant",
    },
    {
      id: 3,
      title: "Trouvez le bien de vos rêves",
      link: "https://images.pexels.com/photos/6775268/pexels-photo-6775268.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  return (
    <Carousel
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={5000}
      infinite={true}
      draggable={true}
      swipeable={true}
      keyBoardControl={true}
      customTransition={"all .8s ease-in-out"}
      transitionDuration={1000}
      removeArrowOnDeviceType={["tablet", "mobile"]}
    >
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="w-full h-[30rem] bg-center bg-cover flex items-center justify-center text-white font-bold text-5xl"
          style={{
            backgroundImage: `linear-gradient(315deg, #4D485599 0%, #00000099 75%), url(${slide.link})`,
          }}
        >
          <div className="w-3/4 mx-auto flex flex-col items-center gap-4">
            <h1 className="text-3xl sm:text-5xl text-center sm:w-[40rem] leading-snug sm:leading-normal uppercase">
              {slide.title}
            </h1>
            {slide.button && (
              <a
                href="/properties"
                title="Page de mes propriétés"
                className="bg-indigo-900 hover:bg-indigo-700 transition text-white font-semibold py-4 px-5 cursor-pointer text-base text-center rounded-sm sm:w-1/6 mt-5"
              >
                {slide.button}
              </a>
            )}
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBanner;
