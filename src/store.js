import {createStore} from 'vuex'
import {db, ref, set} from "@/assets/js/firebase";
/* Création du store */

function setDataFirebase(node, data)
{
    set(ref(db, node), data).then(r => console.log(r));
}

const fetchPlus = (url, requestOptions = {}, retries, context) =>
    fetch(url, requestOptions)
        .then(res => {
            if (res.ok) {
                context.commit('setTitle', false);
                context.commit('setArtist', false)
                context.commit('setCount', 40)
                return res
            }
            if (retries > 0) {
                return fetchPlus(url, requestOptions, retries - 1, context)
            }
            throw new Error(res.status)
        })
        .catch(error => console.error(error.message))

const store = createStore({
    state()
    {
        return {
            isMusicPlaying: false,
            spotifyToken: '',
            showMenuAddPlayer: false,
            clicker: '',
            showModal: false,
            blur: 0,
            title: false,
            artist: false,
            spotifyDeviceId : '',
            responseTest : '',
            count : 40
        }
    }
    ,
    mutations:{
        setSpotifyToken(state, token){
            state.spotifyToken = token;
        },
        setSpotifyDeviceId(state, deviceId) {
            state.spotifyDeviceId = deviceId;
        },
        setIsMusicPlaying(state, isMusicPlaying){
            state.isMusicPlaying = isMusicPlaying;
        }        ,
        setClicker(state, clicker){
            state.clicker = clicker;
        },
        showModal(state, isShowModal) {
            state.showModal = isShowModal;
        },
        setBlur(state, blur){
            state.blur = blur;
        },
        setTitle(state, isTitleFound) {
            state.title = isTitleFound;
        },
        setArtist(state, isArtistFound) {
            state.artist = isArtistFound;
        },
        setCount(state, numberOfSeconds) {
            state.count = numberOfSeconds;
        },
        decrementCount(state){
            state.count -= 1;
        }
    },
    getters: {
        getClicker(state){
            return state.clicker;
        },
        getIsMusicPlaying(state) {
            return state.isMusicPlaying;
        },
        getTitle(state) {
            return state.title;
        },
        getArtist(state) {
            return state.artist;
        },
        getCount(state) {
            return state.count;
        },
    },
    actions:{
        changeModalStatus(context, params){
            context.commit('showModal', params.isShowModal);
            context.commit('setBlur', params.blur);
            context.commit('setClicker', "");
            setDataFirebase(import.meta.env.VITE_FIREBASE_DB_APP + '/isMusicPlaying', params.isMusicPlaying);
        },
        nextTrack(context, timeout = 0){
            let deviceId = context.state.spotifyDeviceId;
            let token = context.state.spotifyToken;
            const requestOptions = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            };

            let url = "https://api.spotify.com/v1/me/player/next?device_id=" + deviceId;

            // On passe à la prochaine musique 10s après que l'artiste et le titre ont été trouvés
            setTimeout(function(){fetchPlus(url, requestOptions, 6, context)}, timeout);

        }
    }
})

export default store;
