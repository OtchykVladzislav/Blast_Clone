import { _decorator, AudioClip, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SoundManager')
export class SoundManager extends Component {
    @property(AudioClip)
    soundBgSound: AudioClip;

    @property(AudioClip)
    teleportSound: AudioSource;

    @property(AudioClip)
    clickSound: AudioSource;

    @property(AudioClip)
    explosionSound: AudioSource;
}


