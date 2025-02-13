import { waitFor } from "@testing-library/react";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../../pages/User/Signup'

describe('Signup 단위 테스트', () => {
    
    let user: ReturnType<typeof userEvent.setup>


    beforeEach(() => {
        user = userEvent.setup();
        render(
        <Signup
        onSwitchView={jest.fn()}
        modalIsOpen={jest.fn()}
        kakaoEmail=""
        />
    )})

    test('이메일 입력시 값이 정상적으로 적용되는지', async() => {
        const emailInput = screen.getByTestId('email-input')
        await user.type(emailInput, 'wjdvlf99@naver.com');
        expect(emailInput).toHaveValue('wjdvlf99@naver.com')
    })

    test('이메일이 11자 미만일 때', async() => {
        const emailInput = screen.getByTestId('email-input');
        await user.type(emailInput, 'te@tet.com')
        
        await waitFor(() => {
            expect(screen.getByText('이메일 형식이 올바르지 않음')).toBeInTheDocument()
        })
    })

    test('닉네임 입력시 값이 정상적으로 적용되는지', async() => {
        const nicknameInput = screen.getByText('nickname-input');
        await user.type(nicknameInput, 'user1');
        expect(nicknameInput).toHaveValue('user1');
    })

    test('패스워드드 입력시 값이 정상적으로 적용되는지', async() => {
        const passwordInput = screen.getByText('password-input');
        await user.type(passwordInput, 'testtest8!');
        expect(passwordInput).toHaveValue('testtest8!');
    })

    test('패스워드 확인인 입력시 값이 정상적으로 적용되는지', async() => {
        const confirmPasswordInput = screen.getByText('confirmPassword-input');
        await user.type(confirmPasswordInput, 'user1');
        expect(confirmPasswordInput).toHaveValue('user1');
    })
})