// Firebase Configuration and Initialization
// Google Cloud Functions経由でFirebaseを使用

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase設定（実際の値に置き換えてください）
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const storage = getStorage(app);

// Cloud Functionsの参照
export const analyzeMealFunction = httpsCallable(functions, 'analyzeMeal');
export const uploadMealPhotoFunction = httpsCallable(functions, 'uploadMealPhoto');

/**
 * 画像ファイルをFirebase Storageにアップロード
 * @param {File} file - アップロードする画像ファイル
 * @returns {Promise<string>} - アップロードされたファイルのパス
 */
export async function uploadPhotoToStorage(file) {
    try {
        // ファイル名を生成
        const timestamp = Date.now();
        const fileName = `meal-photos/${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);

        // ファイルをアップロード
        await uploadBytes(storageRef, file);
        
        // パスを返す（Cloud Functionで使用）
        return fileName;
    } catch (error) {
        console.error('Photo upload error:', error);
        throw error;
    }
}

/**
 * 画像ファイルをBase64に変換（Cloud Functionに送信するため）
 * @param {File} file - 変換するファイル
 * @returns {Promise<string>} - Base64エンコードされた文字列
 */
export async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // data:image/jpeg;base64, の部分を除去
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

console.log("Firebase initialized for Cloud Functions");
