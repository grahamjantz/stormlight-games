import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const navigate = useNavigate()

    const buttonData = [
        {
            text: 'Herald Names',
            path: '/'
        },
        {
            text: 'Herald Order',
            path: '/guess-order'
        },
        {
            text: 'Herald Surges',
            path: '/guess-herald-surges'
        },
        {
            text: 'Surge Glyphs',
            path: '/guess-surges'
        },
        {
            text: 'Radiant Glyphs',
            path: '/radiant-glyphs'
        },
        {
            text: 'Radiant Spren',
            path: '/radiant-spren'
        },
    ]


    const path = window.location.pathname

  return (
    <div className='w-full flex items-center justify-between p-2'>
        <h1 className='text-lg font-bold italic'>Stormlight Games</h1>
        <ul className=' flex justify-end gap-2'>
            {buttonData.map((button, index) => {
                return (
                    <li className='flex items-end'>
                        <button
                            className={`rounded border border-transparent mx-2  px-2 text-base font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-600 ${path === button.path ? 'font-bold bg-gray-700 underline' : ''}`}
                            key={index}
                            onClick={() => {
                                navigate(button.path)
                            }}
                        >
                            {button.text}
                        </button>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export default Header