var app = "http://localhost/kbm-web";
var root = "http://localhost/kbm-api/resource/";
var API = {
    auth: {
        login: root + "auth/login.php",
        logout: root + "auth/logout.php",
        session: root + "auth/session.php"
    },
    user: {
        register: root + "user/register.php",
        verify: root + "user/verify.php",
        resend: root + "user/resendCode.php",
        recover: root + "user/recover.php",
        changePassword: root + "user/changePassword.php",
        update: root + "user/update.php",
        delete: root + "user/delete.php",
        get: root + "user/get.php?user=",
        getSelf: root + "user/getSelf.php",
        getList: root + "user/getList.php",
        checkEmail: root + "user/checkEmail.php?email=",
        checkUsername: root + "user/checkUsername.php?username=",
        getActivities: root + "user/getActivities.php?user=",
        getKnowledgeBases: root + "user/getKnowledgeBases.php",
        getCollaborations: root + "user/getCollaborations.php",
        find: root + "user/find.php?pattern="
    },
    kbase: {
        new: root + "kbase/new.php",
        update: root + "kbase/update.php",
        updatePrivacy: root + "kbase/updatePrivacy.php",
        updateOwner: root + "kbase/updateOwner.php",
        updatePermissions: root + "kbase/updatePermissions.php",
        delete: root + "kbase/delete.php",
        get: root + "kbase/get.php?id=",
        getPublic: root + "kbase/getPublic.php",
        getByTag: root + "kbase/getByTag.php?tag=",
        getPermissions: root + "kbase/getPermissions.php?id="
    },
    folder: {
        new: root + "folder/new.php",
        update: root + "folder/update.php",
        delete: root + "folder/delete.php",
        get: root + "folder/get.php?id="
    },
    doc: {
        new: root + "doc/new.php",
        update: root + "doc/update.php",
        delete: root + "doc/delete.php",
        get: root + "doc/get.php?id=", 
        download: root + "doc/download.php?id="
    },
    tag: {
        getAll: root + "tag/getAll.php"
    },
    info: {
        mailer: root + "info/mailer.php"
    }
};

var files = "http://localhost/kbm-files/";
var FILES = {
    user: {
        profile: files + "images/profile/"
    }
};
