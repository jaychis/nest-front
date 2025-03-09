import React,{ ReactNode } from "react"
import styled from "styled-components"
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
