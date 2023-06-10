import customToastMsg from "./CustomToastMsg";
import Share from 'react-native-share';
import { Platform, Linking } from "react-native";
import { generateLink } from "../common/helper";

export const handleInvite = async () => {

    try {

        let link = await generateLink("", "", true)

        const appName = "GoGetaPet";
        const playStoreUrl = "https://play.google.com/store/apps/details?id=com.pets4u";
        const appStoreUrl = "https://apps.apple.com/in/app/gogetapet/id1581126772"
        Linking.canOpenURL(link)
            .then((isInstalled) => {
                // console.log(isInstalled + "testing")
                if (isInstalled) {
                    const options = {
                        title: "Invite Link",
                        message: 'Invite people Link',
                        url: link,
                    };
                    Share.open(options)
                        .then((res) => {
                            if (!res.success) {
                                customToastMsg(res.message);
                            }
                        })
                }
                else {
                    Linking.openURL(
                        Platform.OS === "ios" ? appStoreUrl : playStoreUrl
                    );

                }
            })

            .catch((err) => {
                Linking.openURL(Platform.OS === "ios" ? appStoreUrl : playStoreUrl);
            });
    }
    catch (e) {
        console.log(e)
    }
};