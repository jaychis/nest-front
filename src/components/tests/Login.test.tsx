import Login from "../../pages/User/Login";
import { render, screen,waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
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
    
        // act로 감싸서 상태 업데이트를 기다림
        await React.act(async () => {
          await user.type(emailInput, 'wjnaver.com');
          await user.click(submitButton);
        });
    
        await waitFor(() => {
          const errorText = screen.getByTestId('error-text');
          expect(errorText).toHaveTextContent('유효한 이메일 주소를 입력하세요');
        });
    });
});