"use client";

import { message, Tooltip } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { type MouseEvent, useState } from "react";
import {
  CheckGlyph,
  ContactIcon,
  CopyGlyph,
  OverflowGlyph,
} from "./ContactIcon";
import { copyToClipboard } from "./clipboard";
import {
  CONTACTS_PAGE_PATH,
  resolveContactAction,
} from "./resolveContactAction";
import type { CartesianOffset, MenuEntry } from "./types";

/** Diameter (px) of each child circle. */
export const CHILD_CIRCLE_SIZE_PX = 48;

/** Diameter (px) of the icon glyph rendered inside a child circle. */
const CHILD_ICON_SIZE_PX = 20;

/** Diameter (px) of the small copy-to-clipboard badge on phone/email items. */
const COPY_BADGE_SIZE_PX = 20;
const COPY_BADGE_ICON_SIZE_PX = 11;

/** How long the "copied" checkmark stays visible before reverting to the copy icon. */
const COPY_FEEDBACK_MS = 1500;

const ITEM_TRANSITION = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.6,
} as const;

const itemVariants = {
  closed: { scale: 0, opacity: 0, x: 0, y: 0 },
  open: (offset: CartesianOffset) => ({
    scale: 1,
    opacity: 1,
    x: offset.x,
    y: offset.y,
    transition: ITEM_TRANSITION,
  }),
};

interface FloatingContactItemProps {
  entry: MenuEntry;
  offset: CartesianOffset;
  onNavigate: () => void;
}

/**
 * Renders a single radial child circle. Handles both real contacts and the
 * synthetic overflow ("all contacts") entry through the same visual treatment,
 * per spec: "Кнопка 'Все контакты' визуально не отличается от остальных".
 */
export function FloatingContactItem({
  entry,
  offset,
  onNavigate,
}: FloatingContactItemProps) {
  const isOverflow = entry.kind === "overflow";
  const [justCopied, setJustCopied] = useState(false);

  const label = isOverflow ? "Все контакты" : entry.title;
  const action = isOverflow
    ? { href: CONTACTS_PAGE_PATH, isInternalRoute: true, openInNewTab: false }
    : resolveContactAction(entry);

  // Телефон/почта — единственные типы, для которых имеет смысл предложить
  // копирование: у пользователя может не быть на компьютере приложения,
  // ассоциированного с tel:/mailto:, и тогда клик по основной кнопке ничего
  // не откроет. Копирование работает независимо от того, настроен ли
  // такой обработчик в системе.
  const isCopyable =
    !isOverflow && (entry.type === "phone" || entry.type === "email");
  const copyValue = !isOverflow ? entry.value : "";

  // Показываем реальный номер/почту в подсказке, а не только название —
  // это и есть требуемое "показываем строку с номером/почтой", доступное
  // при наведении, независимо от того, сработает ли основной клик.
  const tooltipLabel =
    isCopyable && copyValue ? `${label}: ${copyValue}` : label;

  const handleClick = () => {
    onNavigate();
  };

  const handleCopyClick = async (event: MouseEvent) => {
    // Клик по значку копирования не должен переходить по ссылке-родителю
    // и не должен закрывать меню — это самостоятельное действие.
    event.preventDefault();
    event.stopPropagation();

    const succeeded = await copyToClipboard(copyValue);

    if (succeeded) {
      setJustCopied(true);
      message.success("Скопировано");
      window.setTimeout(() => setJustCopied(false), COPY_FEEDBACK_MS);
    } else {
      message.error("Не удалось скопировать");
    }
  };

  const circleClassName =
    "flex items-center justify-center rounded-full bg-[var(--background)] text-[var(--primary)] " +
    "border border-[var(--border)] shadow-[0_2px_8px_var(--shadow-color)] " +
    "transition-shadow duration-150 hover:shadow-[0_6px_18px_var(--shadow-color)]";

  const linkClassName =
    "block rounded-full focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2";

  const content = (
    <motion.div
      className={circleClassName}
      style={{
        width: CHILD_CIRCLE_SIZE_PX,
        height: CHILD_CIRCLE_SIZE_PX,
        willChange: "transform, opacity",
      }}
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
    >
      {isOverflow ? (
        <OverflowGlyph sizePx={CHILD_ICON_SIZE_PX} />
      ) : (
        <ContactIcon
          icon={entry.icon}
          type={entry.type}
          sizePx={CHILD_ICON_SIZE_PX}
        />
      )}
    </motion.div>
  );

  // Важно: `next/link` предназначен только для внутренних роутов приложения
  // (Next-роутер перехватывает клик и делает router.push). Для tel:/mailto:
  // и настоящих внешних ссылок это ломает переход — роутер не может
  // распознать такой href как валидный маршрут (на Windows это выглядело
  // как переход на "/" для почты и полное бездействие для телефона).
  // Поэтому Link используется только когда action.isInternalRoute === true,
  // во всех остальных случаях — обычный <a>, отдающий переход браузеру/ОС
  // напрямую (именно так это и работало на macOS).
  const mainControl = action.isInternalRoute ? (
    <Link
      href={action.href}
      aria-label={label}
      onClick={handleClick}
      className={linkClassName}
    >
      {content}
    </Link>
  ) : (
    <a
      href={action.href}
      {...(action.openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={label}
      onClick={handleClick}
      className={linkClassName}
    >
      {content}
    </a>
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ willChange: "transform, opacity" }}
      custom={offset}
      variants={itemVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <div style={{ transform: "translate(-50%, -50%)", position: "relative" }}>
        <Tooltip title={tooltipLabel} placement="left">
          {mainControl}
        </Tooltip>

        {isCopyable && (
          <button
            type="button"
            onClick={handleCopyClick}
            aria-label={`Скопировать: ${copyValue}`}
            className="absolute flex items-center justify-center rounded-full border border-[var(--border)]
              bg-[var(--background)] text-[var(--primary)] shadow-[0_1px_4px_var(--shadow-color)]
              transition-transform duration-150 hover:scale-110
              focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2"
            style={{
              width: COPY_BADGE_SIZE_PX,
              height: COPY_BADGE_SIZE_PX,
              right: -4,
              bottom: -4,
            }}
          >
            {justCopied ? (
              <CheckGlyph sizePx={COPY_BADGE_ICON_SIZE_PX} />
            ) : (
              <CopyGlyph sizePx={COPY_BADGE_ICON_SIZE_PX} />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
