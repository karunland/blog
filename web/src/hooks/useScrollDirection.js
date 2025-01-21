import { useState, useEffect } from 'react';


//kullanici scroll yaparsa navbar sabi kalsin arka plani rengi degissin


// export default function useScrollDirection() {
//   const [show, setShow] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     const controlNavbar = () => {
//       if (window.scrollY > lastScrollY) { // aşağı scroll
//         setShow(false);
//       } else { // yukarı scroll
//         setShow(true);
//       }
//       setLastScrollY(window.scrollY);
//     };

//     window.addEventListener('scroll', controlNavbar);
//     return () => {
//       window.removeEventListener('scroll', controlNavbar);
//     };
//   }, [lastScrollY]);

//   return show;
// } 