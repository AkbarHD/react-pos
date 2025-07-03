import React, { useState, useRef } from "react";
import { router, useForm } from "@inertiajs/react";
import Webcam from "react-webcam";
import axios from "axios";
import Swal from "sweetalert2";

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState("password");
    const [previewImage, setPreviewImage] = useState(null);

    const webcamRef = useRef(null);

    const { data, setData, errors, reset } = useForm({
        email: "",
        password: "",
        face_image: null,
    });

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            fetch(imageSrc)
                .then((res) => res.blob())
                .then((blob) => {
                    const file = new File([blob], "face-image.jpg", {
                        type: "image/jpeg",
                    });
                    setData("face_image", file);
                    setPreviewImage(imageSrc);
                });
        }
    };

    // Fungsi login
    const loginHandler = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (loginMethod === "password") {
            router.post(
                "/login",
                {
                    email: data.email,
                    password: data.password,
                },
                {
                    onStart: () => {
                        setIsLoading(true);
                    },
                    onSuccess: () => {
                        reset("password");
                        Swal.fire({
                            icon: "success",
                            title: "Login Successful",
                            text: "Welcome back!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            icon: "error",
                            title: "Login Failed",
                            text: errors.email || errors.password || "Invalid email or password",
                            confirmButtonColor: "#d33",
                        });
                    },
                    onFinish: () => {
                        setIsLoading(false);
                    },
                }
            );
        } else {
            const url = "/api/login-with-face";
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("face_image", data.face_image);

            axios
                .post(url, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    if (response.data.redirect) {
                        Swal.fire({
                            icon: "success",
                            title: "Login Successful",
                            text: "Face recognized!",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        window.location.href = response.data.redirect;
                    }
                })
                .catch((error) => {
                    const errorMessage =
                        error.response?.data?.message || "Face recognition failed.";
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: errorMessage,
                        confirmButtonColor: "#d33",
                        footer: "Make sure your face is clearly visible in the image.",
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    return (
        <section className="p-0 d-flex align-items-center position-relative overflow-hidden">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 col-lg-6 d-md-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
                        <div className="p-3 p-lg-5 text-center">
                            <img
                                src="https://is3.cloudhost.id/kodemastery/pos.webp"
                                alt="EasyPOS"
                            />
                            <h2 className="fw-bold">Welcome to EasyPOS</h2>
                            <p className="mb-0 h6 fw-light">
                                Everything You Need!
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-lg-6 m-auto">
                        <div className="row my-3">
                            <div className="col-sm-10 col-xl-8 m-auto">
                                <span className="mb-0 fs-1">👋</span>
                                <h1 className="fs-2">EasyPOS!</h1>
                                <p className="lead mb-4">
                                    Please log in with your account.
                                </p>

                                {/* Switch Login Method */}
                                <div className="d-flex gap-3 mb-4 justify-content-center">
                                    <button
                                        className={`btn ${
                                            loginMethod === "password"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() => setLoginMethod("password")}
                                    >
                                        Password Login
                                    </button>
                                    <button
                                        className={`btn ${
                                            loginMethod === "face"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() => setLoginMethod("face")}
                                    >
                                        Face Login
                                    </button>
                                </div>

                                {/* Note untuk Face Login */}
                                {loginMethod === "face" && (
                                    <div className="alert alert-info mb-4">
                                        <strong>Note:</strong> To use Face Login,
                                        please add a new user first in the{" "}
                                        <strong>Users</strong> menu.
                                    </div>
                                )}

                                <form onSubmit={loginHandler} autoComplete="off">
                                    <div className="mb-4">
                                        <label className="form-label">
                                            Email address *
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${
                                                errors.email ? "is-invalid" : ""
                                            }`}
                                            placeholder="E-mail"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            disabled={isLoading}
                                            autoComplete="off"
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback d-block">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    {loginMethod === "password" ? (
                                        <div className="mb-4">
                                            <label className="form-label">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                className={`form-control ${
                                                    errors.password ? "is-invalid" : ""
                                                }`}
                                                placeholder="Password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData("password", e.target.value)
                                                }
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                            />
                                            {errors.password && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mb-4">
                                            <label className="form-label">
                                                Face Capture *
                                            </label>
                                            <Webcam
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="img-fluid mb-2"
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-info mb-3"
                                                onClick={handleCapture}
                                                disabled={isLoading}
                                            >
                                                Capture Image
                                            </button>
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="img-thumbnail"
                                                />
                                            )}
                                            {errors.face_image && (
                                                <small className="text-danger">
                                                    {errors.face_image}
                                                </small>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-primary mb-0 w-100 btn-md"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div
                                                className="spinner-border spinner-border-sm text-light"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        ) : (
                                            "Login"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
