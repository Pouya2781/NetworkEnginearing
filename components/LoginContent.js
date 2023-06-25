import autoAnimate from '@formkit/auto-animate'
import '../login.css';
import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Joi from 'joi';
import { AiFillInfoCircle } from "react-icons/ai";

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

const LoginContent = ({ setIsLoginOpen, setUserId }) => {
   
    const myButton = document.getElementById('checking');
    const [disabled, setDisabled] = useState(false);
    const [disabledCheck, setDisabledCheck] = useState(false);
    const [userPhoneNumberSave, setUserPhoneNumberSave] = useState("");
    const [disabledSignup, setDisabledSignup] = useState(false);
    const [buttomtxt, setButtomtxt] = useState("Send code");
    const [displayElement, setDisplayElement] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarInfo, setSnackbarInfo] = React.useState({ open: false, message: "test", severity: "error" });
    const parentRef = useRef();
    const [seconds, setSeconds] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [verToken, setVerToken] = useState("");
    const [ error, setError ] = useState("");

    useEffect(() => {

        if (seconds > 0) {
            const intervalId = setInterval(() => {
                // console.log(seconds + "f");
                setSeconds(prevSeconds => prevSeconds - 1);
                // console.log(seconds);
                // setButtomtxt(seconds)
                if (seconds === 1) {
                    setSnackbarInfo({ open: true, message: "Times up, Code Expired", severity: "error" });
                    // myButton.disabled = false;
                    setDisabled(false);
                    setIsCountingDown(false);
                    setButtomtxt("امتحان دوباره");
                }
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [seconds]);

    useEffect(() => {
        if (parentRef.current) {
            autoAnimate(parentRef.current);
        }
    }, [parentRef]);

    const displayError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
    }

    const handleVerifyClick = () => {
        setDisplayElement(false);
    }

    const sendPhoneNumber = async (phone_number) => {
        const response = await fetch("http://localhost:3001/api/auth/number", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    phoneNumber: phone_number
                }
            ),
          });
        return response;
    }

    const checkAPI = async (phone_number, code) => {
        const response = await fetch("http://localhost:3001/api/auth/code", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    phoneNumber: phone_number,
                    code: code
                }
            ),
          });
        return response;
    }
    
    const signingAPI = async (phoneNumber, firstName, lastName, identifier) => {
        const response = await fetch("http://localhost:3001/api/auth/add", {
            method: "POST",
            //mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              'x-ver-token': verToken
            },
            body: JSON.stringify(
                {
                    phoneNumber: phoneNumber,
                    firstName: firstName,
                    ...( lastName != "" && { lastName: lastName } ),
                    identifier: identifier
                }
            ),
          });
        return response;
    }

    const handleClick = async () => {
        if (disabled) return;

        let phoneNum = document.getElementById('phone-number').value;

        function validatePhoneNumberData(body) {
            const schema = Joi.object().keys({
                phone_number: Joi.string().regex(/^\d{11}$/).required()
            });
            
            return schema.validate(body);
        }

        const { error } = validatePhoneNumberData({phone_number: phoneNum});

        if (error != undefined){
            displayError("The entered phone number is not valid")
            return;
        }
        
        setDisabled(true);
        setIsLoading(true);
        let toolate = false;

        const timeout = setTimeout(() => {
            toolate = true;
            displayError("Failed talk to API")
            setIsLoading(false);
            setDisabled(false);
        }, 10000);

        setUserPhoneNumberSave(phoneNum);
        const result = await sendPhoneNumber(phoneNum);
        console.log(result.status)
        let json = await result.json();

        setIsLoading(false);

        if (!toolate) {
            clearTimeout(timeout);

            if (json.status != "ok") return;
            displayError(`Verification code sent! (for testing purpose "${json.data.code}")`);
            handleVerifyClick();

            setSeconds(120);
            setIsCountingDown(true);
        }
    };

    const handleCheckClick = async () => {
        if (disabledCheck) return;
        
        let codeNum = document.getElementById('code-number').value;

        function validateCodeNumberData(body) {
            const schema = Joi.object().keys({
                code_number: Joi.string().regex(/^\d{6}$/).required()
            });
            
            return schema.validate(body);
        }

        const { error } = validateCodeNumberData({code_number: codeNum});
        if (error != undefined){
            displayError("The entered code is not valid");
            return;
        }

        setDisabledCheck(true);
        let toolatecallback = false;

        const checktimeout = setTimeout(() => {
            toolatecallback = true;
            displayError("Failed talk to API-Callback")
            setDisabledCheck(false);
        }, 10000);


        const result = await checkAPI(userPhoneNumberSave, codeNum);
        setVerToken(result.headers.get("x-ver-token"));
        let json = await result.json();

        setDisabledCheck(false);
        if (!toolatecallback) {
            clearTimeout(checktimeout);

            if (json.status == "validation_fail") return;
            if (json.status == "invalid_code") {
                displayError("Code is incorrect!");
                return
            };
            if (json.status == "expired_code") {
                displayError("Code is expired!");
                return
            };
            
            setIsCountingDown(false);
            setSeconds(false);

            if (json.status == "need_sign_up") {
                displayError("Code Verified, need sign-up");
                document.querySelector('.swiper').swiper.slideTo(1);
            }
            else {
                let token = result.headers.get("x-auth-token");
                window.localStorage.setItem("messenger_auth_token", token);
                displayError("Code Verified!");
                
                setUserId(json.data.id);
                setIsLoginOpen(false);
            }
        }
    };

    const handleSignupClick = async () => {
        if (disabledSignup) return;
        
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let identifier = document.getElementById('identifier').value;

        function validateFirstNameData(body) {
            const schema = Joi.object().keys({
                firstName: Joi.string().min(3).max(30).required()
            });
            
            return schema.validate(body);
        }

        let error = validateFirstNameData({ firstName: firstName }).error;
        if (error != undefined) {
            displayError("The entered first name is not valid")
            return;
        }

        function validateLastNameData(body) {
            const schema = Joi.object().keys({
                lastName: Joi.string().min(3).max(30).required()
            });
            
            return schema.validate(body);
        }

        if (lastName != "") {
            error = validateLastNameData({ lastName: lastName }).error;
            if (error != undefined){
                displayError("The entered last name is not valid")
                return;
            }
        }

        function validateIdentifierData(body) {
            const schema = Joi.object().keys({
                identifier: Joi.string().min(5).max(30).required()
            });
            
            return schema.validate(body);
        }

        error = validateIdentifierData({ identifier: identifier }).error;
        if (error != undefined){
            displayError("The entered identifier is not valid")
            return;
        }

        setDisabledSignup(true);
        setIsLoading(true);
        let toolatecallbackfinal = false;

        const checktimeout = setTimeout(() => {
            toolatecallbackfinal = true;
            displayError("Failed talk to API-Callback")
            setDisabledSignup(false);
            setIsLoading(false);
        }, 10000);

        const result = await signingAPI(userPhoneNumberSave, firstName, lastName, identifier);
        let json = await result.json();

        if (!toolatecallbackfinal) {
            clearTimeout(checktimeout);

            if (json.status == "validation_fail") {
                setDisabledSignup(false);
                setIsLoading(false);
                return;
            }

            if (json.status == "database_error") {
                displayError(json.message);
                setDisabledSignup(false);
                setIsLoading(false);
                return;
            }

            let token = result.headers.get("x-auth-token");
            window.localStorage.setItem("messenger_auth_token", token);
            displayError("Sign-up done!");

            //redirect
            setUserId(json.data.id);
            setIsLoginOpen(false);
        }
    };

    return (
        <>
            <Swiper className='mySwiper' allowTouchMove={false}>
                <SwiperSlide className="swiper-slide">
                    <h1 className='title-2'>Sign up / Sign in</h1>
                    <input className='field-1' type="tel" id='phone-number'
                        pattern="[0-9]" maxLength="11" required
                        placeholder="Enter your phone number"
                    />
                    <button onClick={handleClick} id='checking' className='btn' disabled={disabled}>
                        {isLoading ? (
                            <span className="loader"></span>
                        ) : (
                            <span className="simple-font"> {isCountingDown ? seconds : buttomtxt} </span>
                        )}
                    </button>
                    <div className='clr'></div>

                    <div ref={parentRef}>
                        {!displayElement && <input className='field-1-new' type='text' id='code-number' 
                            pattern="[0-9]{6}" maxLength="6" required
                            placeholder="Enter the received code"
                        />
                        }
                        {!displayElement &&
                            <button className='btn' id='checkbtn' onClick={handleCheckClick} disabled={disabledCheck}>
                                <span className="simple-font">Check</span>
                            </button>

                        }
                    </div>
                    <div className='clr'></div>
                </SwiperSlide>

                <SwiperSlide>
                    <h1 className='title-2'>Sign up</h1>
                    <input className='field-2' type="text" id='firstName'
                        required
                        placeholder="Please enter your first name"
                    />
                    <div className="relative">
                        <div class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 border-2 border-white rounded-full -top-[0.5rem] right-[0.9rem] dark:border-gray-900"></div>
                        <input className='field-2' type="text" id='lastName'
                        optional
                        placeholder="Please enter your last name"
                        />
                    </div>
                    
                    <input className='field-2' type="text" id='identifier'
                        required
                        placeholder="Please enter an id for people to find you"
                    />
                    
                    <button onClick={handleSignupClick} className='btn' disabled={disabledSignup}>
                        {isLoading ? (
                            <span className="loader"></span>
                        ) : (
                            <span className="simple-font">Sign up</span>
                        )}
                        
                    </button>
                    <div className='clr'></div>

                    <div>
                        <div className='law text-[16px]'><a href='#'>By signing up you accept the term of service</a></div>
                    </div>
                </SwiperSlide>
            </Swiper>
            {error != "" && <div className="absolute flex items-center bottom-5 p-2 rounded-[0.6rem] bg-gray-300">
                <AiFillInfoCircle className="z-30 p-1 rounded-[1rem] bottom-[6.5rem] w-9 h-9 cursor-pointer"/>
                <p className="pl-1 pr-2">{error}</p>
            </div>}
        </>
    );
};

export default LoginContent;
