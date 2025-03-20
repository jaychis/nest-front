import React from "react"
import { motion } from 'framer-motion';

interface PageTransitionProps {
    children:React.ReactNode
} 

const PageTransition = ({children}:PageTransitionProps) => {


    return(
        <motion.div
        initial='initial'
        animate='in'
        exit='out'
        transition={{ duration: 0.5 }}
        variants={pageEffect}
        style={{width: '100%', height: '100%'}}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition;

export const pageEffect = {
    initial: {
      opacity: 0
    },
    in: {
      opacity: 1
    },
    out: {
      opacity: 0
    }
  };
