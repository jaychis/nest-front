import Login from "../../pages/User/Login";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('로그인 테스트',() => {
    let user: ReturnType<typeof userEvent.setup>

    beforeEach(() => {
        const user = userEvent.setup()
        render(
            <Login
            onSwitchView={jest.fn()}
            modalIsOpen={jest.fn()}
            kakaoEmail=""
            setKakaoEmail={jest.fn()}
            />
        )

        test('ID가 제대로 입력되었을때때',async() => {
            const emailInput = screen.getByTestId('email-input')
            await user.type(emailInput, 'wjdvlf99@naver.com')
            expect(emailInput).toHaveValue('wjdvlf99@naver.com')
        })
    })
})