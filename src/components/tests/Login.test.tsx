import Login from "../../pages/User/Login";
import { render, screen,waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from "react";

describe('로그인 테스트', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup(); // user 할당
        render(
            <Login
                onSwitchView={jest.fn()}
                modalIsOpen={jest.fn()} // modalIsOpen은 보통 boolean 값이므로 수정
                kakaoEmail=""
                setKakaoEmail={jest.fn()}
            />
        );
    });

    test('ID가 제대로 입력되었을 때', async () => {
        const emailInput = screen.getByTestId('email-input');
        await React.act(async() => {
            await user.type(emailInput, 'wjdvlf99@naver.com');
        })
        expect(emailInput).toHaveValue('wjdvlf99@naver.com');
    });

    test('ID가 올바르지 않을 때', async () => {
        const emailInput = screen.getByTestId('email-input');
        const submitButton = screen.getByTestId('submit-button');
    
        await React.act(async () => {
          await user.type(emailInput, 'wjnaver.com');
          await user.click(submitButton);
        });
    
        await waitFor(() => {
          const errorText = screen.getByTestId('error-text');
          expect(errorText).toHaveTextContent('유효한 이메일 주소를 입력하세요');
        });
    });

    test('ID혹은 비밀번호가 올바르지 않을때', async() => {
        const emailInput = screen.getByTestId('email-input')
        const passwordInput = screen.getByTestId('password-input')
        const submitButton = screen.getByTestId('submit-button');

        await React.act(async () => {
            await user.type(emailInput, 'tka22@test8.com')
            await user.type(passwordInput, 'testtest8!')
            await user.click(submitButton)
        })

        await waitFor(() => {
            const errorText = screen.getByTestId('error-text');
            expect(errorText).toHaveTextContent('로그인 실패. 이메일과 비밀번호를 확인하세요.');
        });
    })

    test('비밀번호 형식이 잘못 됐을때', async() => {
        const passwordInput = screen.getByTestId('password-input')
        const submitButton = screen.getByTestId('submit-button');
        const emailInput = screen.getByTestId('email-input');

        await React.act(async() => {
            await user.type(emailInput, 'wjdvlf99@naver.com')
            await user.type(passwordInput, 'testtest')
            await user.click(submitButton)  
        })

        await waitFor(() => {
            const errorText = screen.getByTestId('error-text');
            expect(errorText).toHaveTextContent('비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수문자입니다.');
        })
    })
});