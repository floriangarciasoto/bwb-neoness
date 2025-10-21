# Netflop

Fork de Netflix.

## Installation rapide du serveur Apache

Ajout des fichiers au `/var/html` :

```bash
$ sudo ln -s /mnt/c/Users/fgs/code/bwb/bwb-netflop /var/www/netflop.bwb.local
```

Ajout de la configuration du serveur :

```bash
$ sudo sed "s|DOMAIN|netflop.bwb.local|g" /mnt/c/Users/fgs/code/templates/apache2.local.conf
  | sudo tee /etc/apache2/sites-available/netflop.bwb.local.conf > /dev/null
```

Activation du site :

```bash
$ sudo a2ensite netflop.bwb.local.conf
$ sudo service apache2 reload
```

Ajout du localhost :

```powershell
> notepad C:\Windows\System32\drivers\etc\hosts
```

```
127.0.0.1	netflop.bwb.local
::1	netflop.bwb.local
```

Vérification de l'accès au site :

```bash
$ apache2ctl -t -D DUMP_VHOSTS
VirtualHost configuration:
*:80                   is a NameVirtualHost
  default server FGS-PC. (/etc/apache2/sites-enabled/000-default.conf:1)
  port 80 namevhost FGS-PC. (/etc/apache2/sites-enabled/000-default.conf:1)

[...]

  port 80 namevhost netflop.bwb.local (/etc/apache2/sites-enabled/netflop.bwb.local.conf:1)
    alias www.netflop.bwb.local
```

It works!
