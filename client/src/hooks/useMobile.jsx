import { useEffect, useState } from "react";

const useMobile = (breakPoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakPoint);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakPoint);
        };

        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [breakPoint]);

    return [isMobile];
};

export default useMobile;

// import { useEffect, useState } from "react"

// const useMobile = (breakPoint = 768) => {
//     const [isMobile, setIsMobile] = useState(window.innerWidth < breakPoint)
    
//     const handleResize = () => {
//         const checkPoint = window.innerWidth < breakPoint
//         setIsMobile(checkPoint)
//     }

//     useEffect(() => {
//         handleResize()

//         window.addEventListener('resize', handleResize())

//         return () => {
//             window.removeEventListener('resize', handleResize())
//         }
//     }, [])

//     return [isMobile]
// }

// export default useMobile


