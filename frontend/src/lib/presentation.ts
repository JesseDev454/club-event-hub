type CategoryVisual = {
  image: string;
  icon: string;
  accentClassName: string;
  pillClassName: string;
};

const defaultEventVisual: CategoryVisual = {
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB47vYS6K3LOTDUW85J-5Js3CAsOBcGeOWSrsrHpfXLNyNQoeAEAmo5MsVaPs8krPQ6LzdHEXz9wZp5nRJIHFmZOvSNwfurrYE7ewLVzaMPYvEmKhbRiz0oG6Im6x_Wuv9CCdY2cxm5FYRsuibIvFdUe_zOoddCt4GHg7zOik7AC7X7PvyFbsrgQH63bIJ4HfijB8bDEdbpww9UAsvP8xjBvWkGlDFTtOltvDj2aOkOpxpL1uSWW1zsCKq-Tn7UJxujGk1A-3moITAP",
  icon: "event",
  accentClassName: "bg-primary/10 text-primary",
  pillClassName: "bg-white/90 text-primary",
};

const categoryVisuals: Record<string, CategoryVisual> = {
  technology: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAH55GTHebear467p_YD9Rb4bnt7ZKDRNH-u72FA4rf93dAL7clsBv4bxZNsZPl4BiNIv4z3JS5nKytAKg9K5SgUmI7bmsUjeVZlZyXVpbSik88Zpa2e2FzFO2I9fuXuDYdvn73fq-oYhUiIwLBnPgizgtYSrCr7ILvISioYvpkP3WXY2jNSLmWzmMcSv1dXf19tt5TsCvghUC8xFLcly4HoPBesJHFfMxYUz9hcE7GEvXT-K9f3Lx377OqDgxb6JkbTeWCNUFvxhFf",
    icon: "terminal",
    accentClassName: "bg-primary/10 text-primary",
    pillClassName: "bg-white/90 text-primary",
  },
  tech: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9iPVAKLZjwdgYbwYnqN_MCnY5Qt-n5a2T4Fr_fqm_qg2ao4ChtzJma_JwTvWCboF3XhDsPRfCaPcWsF_4EJ6RgWmCZ2Mq7-hGF8_rifjoDxtiytp_0GV2fL8WR8G5U7E_Kuc5_TMbkFB-DUjzkxvUwyYSzFLABzTWdayqgKt1fKZIAffQOUDsIW4fLIz67wAvCknqBoyudwAs5lEXVxGg1PWuH2M9vj902n3y-DKUfXJjyzeEMxtSFHdBORn-OJwRMuc5WZjXYTw3",
    icon: "terminal",
    accentClassName: "bg-primary/10 text-primary",
    pillClassName: "bg-white/90 text-primary",
  },
  career: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjMTSdCcbltLGzit3iwgq3RgYdhO9yfwg638pxoXlm7W-ge1_6hHUvlsmtiXnyM_HL_23k0NTNvy_3g_GIU1C5OAfUgfxU-qNOqMoWxpFc7mXqHlyw6MacPb5-alkWMPB2oQrob4xiux93AScXjzh-vNRzyXDhQ63eLrGkGlCLkxzvsZFN7e5dp5b5TLvTnHrMdzz3StJlq78WiagFsgBOcctq8oEqkeUXMTdCsEeAKc6-p8hi4hN8dJQZg8Vkdmk2q4l7KwqdXF4-",
    icon: "work",
    accentClassName: "bg-secondary-container text-on-secondary-container",
    pillClassName: "bg-white/90 text-primary",
  },
  academic: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBChanmqdkfevhO0GO_BLu1OBlL_LrFNkTOaVoZDAOwS5HdcySt9Plewlo_WhqLVq4aLcbN6JI9O7ih67Xna8_Woprpt9DVZjbcSxXf3zdJmQf8qtGQ2H2fNKN2L5ArXuhA8s1hySOpiotZ8Rl_92k7cINBGyHiSgKk6WiqnDevWN_FIqXkeAWDUX1dcWnxJ20s9FX7x7Em6W7fKebwKdEtLBnP5Xwtd81L0IZgabY-jDciT9aemtnqYHfD1wGkdq0kuLQxNYoiN2zt",
    icon: "school",
    accentClassName: "bg-slate-100 text-primary",
    pillClassName: "bg-white/90 text-primary",
  },
  social: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAheccm8aWi2knS9r9tAxec9wHXpuGVMiMEx--5BAXXDFZVGE6N7N-KlIRfjxW1x6z3EL_lb14-GAmiP6p-XnSnhHYpsFf2RRLv9GGDNzn1CcuYdb_t3xbMtWXyQ3MzUYPRtltJLr8AbYiK4YolMEhcrRwfkXlxCVM91dA9VpQLLek-df5nvmGeF9NgpZpPGQPSyLvYN7sbdZnNa84UM3T7owR7gheOyw-IjCqF8xNZuH85JsEwTF4Rg94SSEkHEdN2JuzPKOABQggA",
    icon: "celebration",
    accentClassName: "bg-tertiary-fixed text-tertiary",
    pillClassName: "bg-white/90 text-primary",
  },
  sports: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcrs92iubKGmfOR7rWkDOKzuJYUnUCcP80k2Sl37s88GmeyB9kySYcOSmdCr1y2VdXSkgm9JYFKWJG29s5iRIz8eZ2k0W7mq6VOwiSfgNV_xYrHMQGHPWsKMIULqWQOYrlw9dCvf0QgaLBTtLSin9AyXLBJ5MCZTYqnPf4Zj1uv_LSa00Q_etydhOJGZQAjvUulvXhPoLETQ0zWGjLkER7E9MVqZRgmQIEoPoBz1uFQyGK0zi0iDQcKJY9dNQRlxEGSxa2ofu9XRP0",
    icon: "sports_soccer",
    accentClassName: "bg-secondary-container text-on-secondary-container",
    pillClassName: "bg-white/90 text-primary",
  },
  arts: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6Rx37ROsSvb40dimfUdjlK93XLfVqLYpzq6oya8KP-TgP28j3Efa0al7-dnlYcmWxpjEzJHsL4ZA6EVMJ-zORbzhe7JdBIEryrsJleNCi9EEwGBQEbfAdpTFGifXTdpSD1MxQ66_c98nk1uKEbAgOGhBqSMS2sP6EqIinrnJW_CAZ_jFaadaBOg3g8hyOgrittFmD1i35K1z_nznQs8crdF1siLyvg3j8dY_3VpUBLFV40prU479B3-6-DfwJOhEpw3T3ViNKobRX",
    icon: "palette",
    accentClassName: "bg-tertiary-fixed text-tertiary",
    pillClassName: "bg-white/90 text-primary",
  },
  volunteering: {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAM0Ritd0Wa5TBupyB6Pd9Ddpio2PQc6fCi96svUF3m-vkVpm_EOOToQHwcMISaIPDeGgTsGPIr9393vQYnNr7GxzjUqLG-wRDBFzAFoIl8nilQr31j9VzJtGIcwmcmky4tuJabdWlS7rUlo_IlsvRvgrIbztC8P4OOS6gTkPadEOZJBxJyQasmuSu9KRb05JsXWWpVWVNGG8gf8b93AwegqgArOZr9yc3SuN96IAOcnpoy2EsEWbBfR7zkaz2prLNmdS4fEKej71kE",
    icon: "public",
    accentClassName: "bg-secondary-container text-on-secondary-container",
    pillClassName: "bg-white/90 text-primary",
  },
};

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

export function getCategoryVisual(category: string): CategoryVisual {
  return categoryVisuals[normalizeCategory(category)] ?? defaultEventVisual;
}
